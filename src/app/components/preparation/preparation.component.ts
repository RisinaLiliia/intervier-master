import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';

import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { QuestionItem } from '../category/category.component.config';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { PreparationService } from '../../services/preparation.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-preparation',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    TruncatePipe,
    MatProgressSpinnerModule,
  ],
  templateUrl: './preparation.component.html',
  styleUrl: './preparation.component.scss',
})
export class PreparationComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['position', 'question', 'answer', 'actions'];

  dataSource = new MatTableDataSource<QuestionItem>([]);
  category = '';
  isLoading = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly dialog: MatDialog,
    private readonly preparationService: PreparationService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$),
        tap(() => (this.isLoading = true)),
        switchMap((params) => {
          this.category = params['tabName'] ?? '';
          return this.preparationService.getPreparationQuestionsByCategory(
            this.category
          );
        })
      )
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openDeleteDialog(question: QuestionItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent, {
      width: '333px',
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.deleteAnswer(question.id);
        }
      });
  }

  deleteAnswer(id: number): void {
    this.preparationService
      .deletePreparationQuestionById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter(
          (question) => question.id !== id
        );
      });
  }
}
