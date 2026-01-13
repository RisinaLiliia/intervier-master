import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';

import { QuestionItem } from '../../core/questions/question.model';
import { QuestionsService } from '../../core/questions/questions.service';
import { AuthFacade } from '../../core/auth/auth.facade';
import { AuthRequiredModalComponent } from '../auth-required-modal/auth-required.modal';
import { EditAnswerModalComponent } from '../edit-answer-modal/edit-answer-modal.component';

@Component({
  selector: 'app-questions-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit {

  private readonly destroyRef = inject(DestroyRef);
  private readonly questionsService = inject(QuestionsService);
  private readonly auth = inject(AuthFacade);
  private readonly dialog = inject(MatDialog);

  questions: QuestionItem[] = [];
  displayedColumns = ['position', 'question', 'actions'];
  isLoading = false;
  private currentUserId?: string;

  ngOnInit(): void {
    this.auth.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        this.currentUserId = user?._id;
        this.loadQuestions();
      });
  }

  private loadQuestions(): void {
    this.isLoading = true;this.questionsService.getQuestions('1', this.currentUserId)
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe({
    next: (q: QuestionItem[]) => {
      this.questions = q;
      this.isLoading = false;
    },
    error: (err: any) => {
      this.isLoading = false;
      if (err?.status === 401) console.warn('User not authorized yet');
      else console.error('Error loading questions', err);
    }
  });

  }

  async openEditDialog(question: QuestionItem): Promise<void> {
    const isAuth = await firstValueFrom(this.auth.isAuth$.pipe(takeUntilDestroyed(this.destroyRef)));
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
  }
}

