import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { switchMap, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { QuestionItem } from '../../models/question.model';
import { QuestionsService } from '../../services/questions.service';
import { AuthFacade } from '../../core/auth/auth.facade';
import { AuthRequiredModalComponent } from '../auth-required-modal/auth-required.modal';
import { EditAnswerModalComponent } from '../edit-answer-modal/edit-answer-modal.component';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TruncatePipe
  ],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent {
  private destroyRef = inject(DestroyRef);

  questions: QuestionItem[] = [];
  displayedColumns = ['position', 'question', 'answer', 'actions'];
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private questionsService: QuestionsService,
    private auth: AuthFacade,
    private dialog: MatDialog
  ) {
    this.initCategoryListener();
  }

  private initCategoryListener(): void {
    this.route.paramMap
      .pipe(
        tap(() => (this.isLoading = true)),
        switchMap(params =>
          this.questionsService.getByCategory(params.get('categoryId')!)
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: questions => {
          this.questions = questions;
          this.isLoading = false;
        },
        error: () => (this.isLoading = false),
      });
  }

  openGenerateDialog(question: QuestionItem): void {
    this.auth.isAuth$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(isAuth => {
        if (!isAuth) {
          this.dialog.open(AuthRequiredModalComponent);
          return;
        }

        const ref = this.dialog.open(EditAnswerModalComponent, {
          width: '600px',
          data: {
            questionId: question._id,
            question: question.question,
            answer: question.answer,
            answerId: question.answerId
          }
        });

        ref.afterClosed().subscribe(result => {
          if (result?.answer) {
            question.answer = result.answer;
          }
        });
      });
  }
}
