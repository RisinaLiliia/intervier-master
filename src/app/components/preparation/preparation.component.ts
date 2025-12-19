import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { EditAnswerModalComponent } from '../edit-answer-modal/edit-answer-modal.component';
import { QuestionItem } from '../../models/question.model';
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
    ReactiveFormsModule,
  ],
  templateUrl: './preparation.component.html',
  styleUrls: ['./preparation.component.scss'],
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
        next: (questions: QuestionItem[]) => {
          this.dataSource.data = questions;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading preparation questions', err);
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openEditDialog(question: QuestionItem): void {
    this.dialog.open(EditAnswerModalComponent, {
      width: '600px',
      data: question,
    });
  }
}
