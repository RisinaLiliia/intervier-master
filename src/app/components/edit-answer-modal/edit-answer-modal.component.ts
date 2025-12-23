import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatDialogModule
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { HttpErrorResponse } from '@angular/common/http';

import { QuestionItem } from '../../models/question.model';
import { QuestionsService } from '../../services/questions.service';
import { OpenAiIntegrationService } from '../../services/open-ai-integration.service';
import { AuthRequiredModalComponent } from '../auth-required-modal/auth-required.modal';

@Component({
  standalone: true,
  selector: 'app-edit-answer-modal',
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

  form = this.fb.group({
    answer: ['']
  });

  isGenerating = false;
  isSaving = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: QuestionItem,
    private fb: FormBuilder,
    private questionsService: QuestionsService,
    private aiService: OpenAiIntegrationService,
    private dialogRef: MatDialogRef<EditAnswerModalComponent>,
    private dialog: MatDialog
  ) {
    this.form.patchValue({ answer: data.answer ?? '' });
  }

  generateAnswer(): void {
    this.isGenerating = true;

    this.aiService.generateAnswer(this.data.question).subscribe({
      next: answer => {
        this.form.patchValue({ answer });
        this.isGenerating = false;
      },
      error: () => {
        this.isGenerating = false;
      }
    });
  }

  save(): void {
    if (this.form.invalid) return;

    this.isSaving = true;

    this.questionsService.update(
      this.data.id,
      this.form.value.answer!
    ).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err: HttpErrorResponse) => {
        this.isSaving = false;
        this.handleAuthError(err);
      }
    });
  }

  deleteAnswer(): void {
    this.questionsService.delete(this.data.id).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err: HttpErrorResponse) => {
        this.handleAuthError(err);
      }
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

