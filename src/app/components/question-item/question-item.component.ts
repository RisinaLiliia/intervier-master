import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { QuestionsService } from '../../services/question.service';

@Component({
  selector: 'app-question-item',
  templateUrl: './question-item.component.html',
})
export class QuestionItemComponent {
  constructor(private dialog: MatDialog, private questionsService: QuestionsService) {}

  onDeleteQuestion(id: number) {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.questionsService.deleteQuestion(id).subscribe({
          next: () => {
            console.log('Question deleted');
          },
          error: (err) => {
            console.error('Delete failed', err);
          }
        });
      }
    });
  }
}

