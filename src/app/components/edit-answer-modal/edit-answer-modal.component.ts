import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatDialogModule
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { HttpErrorResponse } from '@angular/common/http';

import { QuestionsService } from '../../services/questions.service';
import { OpenAiIntegrationService } from '../../services/open-ai-integration.service';
import { AuthRequiredModalComponent } from '../auth-required-modal/auth-required.modal';

export interface EditAnswerDialogData {
  questionId: string;
  question: string;
  answer?: string;
  answerId?: string;
}


@Component({
  selector: 'app-edit-answer-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './edit-answer-modal.component.html',
  styleUrls: ['./edit-answer-modal.component.scss']
})
export class EditAnswerModalComponent {

  readonly form = this.fb.nonNullable.group({
    answer: ['', Validators.required]
  });

  isGenerating = false;
  isSaving = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: EditAnswerDialogData,
    private readonly fb: FormBuilder,
    private readonly questionsService: QuestionsService,
    private readonly aiService: OpenAiIntegrationService,
    private readonly dialogRef: MatDialogRef<EditAnswerModalComponent>,
    private readonly dialog: MatDialog
  ) {
    if (data.answer) {
      this.form.patchValue({ answer: data.answer });
    }
  }

  generateAnswer(): void {
    this.isGenerating = true;
    this.aiService.generateAnswer(this.data.question).subscribe({
      next: (answer) => {
        this.form.patchValue({ answer });
        this.isGenerating = false;
      },
      error: () => (this.isGenerating = false)
    });
  }

  save(): void {
    if (this.form.invalid) return;

    this.isSaving = true;
    const { answer } = this.form.getRawValue();

    const request$ = this.data.answerId
      ? this.questionsService.updateAnswer(
        this.data.questionId,
        this.data.answerId,
        answer
      )
      : this.questionsService.createAnswer(
        this.data.questionId,
        answer
      );

    request$.subscribe({
      next: () => {
        this.isSaving = false;
        this.dialogRef.close({ answer });
      },
      error: (err: HttpErrorResponse) => {
        this.isSaving = false;
        this.handleAuthError(err);
      }
    });
  }

  deleteAnswer(): void {
    if (!this.data.answerId) {
      console.warn('No user answer to delete');
      return;
    }

    if (!this.data.questionId) {
      console.error('Cannot delete answer: questionId is missing');
      return;
    }

    this.questionsService.deleteAnswer(this.data.questionId, this.data.answerId).subscribe({
      next: () => {
        this.data.answer = undefined;
        this.data.answerId = undefined;

        this.dialogRef.close({ answer: undefined });
      },
      error: (err: HttpErrorResponse) => this.handleAuthError(err)
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  private handleAuthError(err: HttpErrorResponse): void {
    if (err.status === 401) {
      this.dialogRef.close();
      this.dialog.open(AuthRequiredModalComponent);
    }
  }

}
