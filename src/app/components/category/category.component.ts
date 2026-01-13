import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { switchMap, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';

import { QuestionItem } from '../../models/question.model';
import { CategoryService } from '../../services/categories.service';
import { AuthFacade } from '../../core/auth/auth.facade';
import { AuthRequiredModalComponent } from '../auth-required-modal/auth-required.modal';
import { EditAnswerModalComponent } from '../edit-answer-modal/edit-answer-modal.component';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatProgressSpinnerModule, TruncatePipe],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly categoryService = inject(CategoryService);
  private readonly auth = inject(AuthFacade);
  private readonly dialog = inject(MatDialog);

  questions: QuestionItem[] = [];
  displayedColumns = ['position', 'question', 'answer', 'actions'];
  isLoading = false;
  private currentUserId?: string;
  private currentCategoryId?: string;

  constructor() {
    this.initUser();
    this.initCategoryListener();
  }

  private initUser(): void {
    this.auth.user$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => this.currentUserId = user?._id);
  }

  private initCategoryListener(): void {
    this.route.paramMap.pipe(
      tap(() => (this.isLoading = true)),
      switchMap(params => {
        this.currentCategoryId = params.get('categoryId')!;
        return this.loadQuestions();
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: questions => { this.questions = questions; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  private loadQuestions() {
    if (!this.currentCategoryId) return [];
    return this.categoryService.getQuestions(this.currentCategoryId, this.currentUserId);
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
        return;
      }
      if (result?.answer) {
        question.displayedAnswer.text = result.answer;
        question.displayedAnswer.userId = this.currentUserId!;
        question.displayedAnswer._id = result.answerId;
      }
    };
  }
}
