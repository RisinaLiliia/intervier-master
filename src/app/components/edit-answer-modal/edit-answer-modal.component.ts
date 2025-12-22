import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { QuestionItem } from '../../models/question.model';
import { QuestionsService } from '../../services/questions.service';
import { OpenAiIntegrationService } from '../../services/open-ai-integration.service';

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

  form = this.fb.group({ answer: [''] });
  isGenerating = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: QuestionItem,
    private fb: FormBuilder,
    private questionsService: QuestionsService,
    private aiService: OpenAiIntegrationService,
    private dialogRef: MatDialogRef<EditAnswerModalComponent>
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
      error: () => (this.isGenerating = false)
    });
  }

  save(): void {
    this.questionsService
      .update(this.data.id, this.form.value.answer!)
      .subscribe(() => this.dialogRef.close(true));
  }

  deleteAnswer(): void {
    this.questionsService
      .delete(this.data.id)
      .subscribe(() => this.dialogRef.close(true));
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
