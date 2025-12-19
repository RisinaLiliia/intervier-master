import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import { PreparationService } from '../../services/preparation.service';
import { OpenAiIntegrationService } from '../../services/open-ai-integration.service';
import { QuestionItem } from '../../models/question.model';

@Component({
  selector: 'app-edit-answer-modal',
  standalone: true,
  templateUrl: './edit-answer-modal.component.html',
  styleUrls: ['./edit-answer-modal.component.scss'],
  imports: [
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
})
export class EditAnswerModalComponent {
  form = this.fb.group({ answer: [''] });
  isGenerating = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: QuestionItem,
    public dialogRef: MatDialogRef<EditAnswerModalComponent>,
    private fb: FormBuilder,
    private preparationService: PreparationService,
    private aiService: OpenAiIntegrationService
  ) {
    this.form.patchValue({ answer: data.answer ?? '' });
  }

  generateAnswer() {
    this.isGenerating = true;
    this.aiService.generateAnswer(this.data.question).subscribe({
      next: (answer: string) => {
        this.form.patchValue({ answer });
        this.isGenerating = false;
      },
      error: () => (this.isGenerating = false),
    });
  }

  save() {
    this.preparationService
      .updateAnswer(this.data.id, this.form.value.answer!)
      .subscribe(() => this.dialogRef.close(this.form.value.answer));
  }

  deleteAnswer() {
    this.preparationService
      .deleteAnswer(this.data.id)
      .subscribe(() => this.dialogRef.close(''));
  }

  cancel() {
    this.dialogRef.close(null); 
  }
}
