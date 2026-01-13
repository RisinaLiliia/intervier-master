import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { QuestionItem } from '../../models/question.model';
import { CategoryService } from '../../services/categories.service';
import { AuthFacade } from '../../core/auth/auth.facade';
import { AuthRequiredModalComponent } from '../auth-required-modal/auth-required.modal';
import { EditAnswerModalComponent } from '../edit-answer-modal/edit-answer-modal.component';

@Component({
  selector: 'app-preparation',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './preparation.component.html',
  styleUrls: ['./preparation.component.scss']
})
export class PreparationComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly categoryService = inject(CategoryService);
  private readonly auth = inject(AuthFacade);
  private readonly dialog = inject(MatDialog);

  questions: QuestionItem[] = [];
  displayedColumns = ['position', 'question', 'actions'];
  isLoading = false;
  private currentUserId?: string;

  ngOnInit(): void {
    const categoryId = this.route.snapshot.queryParamMap.get('categoryId');
    if (!categoryId) return;

    this.auth.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        this.currentUserId = user?._id;
        this.loadQuestions(categoryId);
      });
  }

  private loadQuestions(categoryId: string): void {
    this.isLoading = true;

    this.categoryService.getQuestions(categoryId, this.currentUserId)
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe({
    next: questions => {
      this.questions = questions;
      this.isLoading = false;
    },
    error: err => {
      this.isLoading = false;
      if (err?.status === 401 && err?.error?.message === 'NO_TOKEN') return;
      if (err?.status === 401) this.dialog.open(AuthRequiredModalComponent);
      else console.error('Error loading questions', err);
    }
  });

  }

  openEditDialog(question: QuestionItem): void {
    this.auth.isAuth$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(isAuth => {
        if (!isAuth) {
          this.dialog.open(AuthRequiredModalComponent);
          return;
        }

        const dialogRef = this.dialog.open(EditAnswerModalComponent, {
          width: '600px',
          data: {
            questionId: question._id,
            question: question.question,
            answer: question.displayedAnswer.text,
            hasUserAnswer: !!question.displayedAnswer.userId,
            defaultAnswer: question.defaultAnswer?.text
          }
        });

        dialogRef.componentInstance.onChange = (result: any) => {
          if (result?.deleted) {
            question.displayedAnswer.text = question.defaultAnswer?.text || '';
            question.displayedAnswer.userId = undefined;
            question.displayedAnswer._id = undefined;
          } else if (result?.answer) {
            question.displayedAnswer.text = result.answer;
            question.displayedAnswer.userId = this.currentUserId!;
            question.displayedAnswer._id = result.answerId;
          }
        };
      });
  }
}


