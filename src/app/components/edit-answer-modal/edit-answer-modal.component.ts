import { Component, Inject, DestroyRef, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { take } from 'rxjs';

import { QuestionsService } from '../../services/questions.service';
import { OpenAiIntegrationService } from '../../services/open-ai-integration.service';
import { AuthFacade } from '../../core/auth/auth.facade';
import { AuthRequiredModalComponent } from '../auth-required-modal/auth-required.modal';

export interface EditAnswerDialogData {
  questionId: string;
  question: string;
  answer: string;
  hasUserAnswer: boolean;
  defaultAnswer?: string;
}

@Component({
  selector: 'app-edit-answer-modal',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatInputModule],
  templateUrl: './edit-answer-modal.component.html',
  styleUrls: ['./edit-answer-modal.component.scss']
})
export class EditAnswerModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly questionsService = inject(QuestionsService);
  private readonly auth = inject(AuthFacade);
  private readonly dialog = inject(MatDialog);
  private readonly dialogRef = inject(MatDialogRef<EditAnswerModalComponent>);
  private readonly destroyRef = inject(DestroyRef);

  readonly form = this.fb.nonNullable.group({
    answer: ['', Validators.required]
  });

  currentAnswerText: string | null;
  hasUserAnswer: boolean;
  isSaving = false;
  isGenerating = false;
  public onChange?: (result: { answer?: string; answerId?: string; deleted?: boolean }) => void;

  constructor(@Inject(MAT_DIALOG_DATA) public readonly data: EditAnswerDialogData,
              private readonly aiService: OpenAiIntegrationService) {
    this.currentAnswerText = data.answer || data.defaultAnswer || null;
    this.hasUserAnswer = data.hasUserAnswer;
  }

  generateAnswer(): void {
    this.isGenerating = true;
    this.aiService.generateAnswer(this.data.question).subscribe({
      next: (answer: string) => {
        this.form.setValue({ answer });
        this.isGenerating = false;
      },
      error: () => this.isGenerating = false
    });
  }

  save(): void {
    if (this.form.invalid) return;
    const { answer } = this.form.getRawValue();

    this.auth.user$.pipe(take(1)).subscribe(user => {
  if (!user) {
    this.dialog.open(AuthRequiredModalComponent);
    return;
  }

  this.isSaving = true;
  this.questionsService.upsertAnswer(this.data.questionId, answer).subscribe({
    next: res => {
      this.currentAnswerText = answer;
      this.hasUserAnswer = true;
      this.form.reset({ answer: '' });
      this.onChange?.({ answer, answerId: res._id });
    },
    error: err => this.handleAuthError(err),
    complete: () => this.isSaving = false
  });
});


  }

  deleteAnswer(): void {
    if (!this.hasUserAnswer) return;
    this.questionsService.deleteAnswer(this.data.questionId).subscribe({
      next: () => {
        this.currentAnswerText = this.data.defaultAnswer || null;
        this.hasUserAnswer = false;
        this.form.reset({ answer: '' });
        this.onChange?.({ deleted: true });
      },
      error: (err: any) => this.handleAuthError(err)
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  private handleAuthError(err: any): void {
    this.isSaving = false;
    if (err?.status === 401) {
      this.dialogRef.close();
      this.dialog.open(AuthRequiredModalComponent);
    }
  }
}
