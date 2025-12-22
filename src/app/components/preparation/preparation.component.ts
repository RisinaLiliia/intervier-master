import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject, switchMap, takeUntil, tap, take } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { EditAnswerModalComponent } from '../edit-answer-modal/edit-answer-modal.component';
import { QuestionItem } from '../../models/question.model';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { QuestionsService } from '../../services/questions.service';
import { AuthFacade } from '../../core/auth.facade';
import { AuthRequiredModalComponent } from '../auth-required-modal/auth-required.modal';

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
  showAnswer = false;
  dataSource = new MatTableDataSource<QuestionItem>([]);
  categoryId!: number;
  isLoading = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly dialog: MatDialog,
    private readonly questionsService: QuestionsService,
    private readonly auth: AuthFacade,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
  this.route.url
    .pipe(
      takeUntil(this.destroy$),
      tap(() => (this.isLoading = true)),
      switchMap(urlSegments => {
        const path = urlSegments.map(seg => seg.path).join('/');
        if (path.includes('preparation')) {
          this.displayedColumns = ['position', 'question', 'answer', 'actions'];
          this.showAnswer = true;
        } else {
          this.displayedColumns = ['position', 'question', 'actions'];
          this.showAnswer = false;
        }

        const categoryId = Number(this.route.snapshot.params['categoryId']);
        return this.questionsService.getByCategory(categoryId);
      })
    )
    .subscribe({
      next: (questions: QuestionItem[]) => {
        this.dataSource.data = questions;
        this.isLoading = false;
      },
      error: err => {
        console.error(err);
        this.isLoading = false;
      }
    });
}




  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openEditDialog(question: QuestionItem): void {
    this.auth.isAuth$.pipe(take(1)).subscribe(isAuth => {
      if (!isAuth) {
        this.dialog.open(AuthRequiredModalComponent);
        return;
      }

      this.dialog.open(EditAnswerModalComponent, {
        width: '600px',
        data: question,
      });
    });
  }
}

