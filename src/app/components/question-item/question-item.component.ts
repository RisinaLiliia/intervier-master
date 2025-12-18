import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { CategoriesService } from '../../services/categories.service';
import { QuestionItem } from '../../models/question.model';

@Component({
  selector: 'app-question-item',
  templateUrl: './question-item.component.html',
})
export class QuestionItemComponent {
  @Input() question!: QuestionItem;
  @Input() category!: string; 

  constructor(private dialog: MatDialog, private categoriesService: CategoriesService) {}

  onDeleteQuestion() {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed && this.question && this.category) {
        this.categoriesService
          .deleteCategoryQuestionById(this.category, this.question.id)
          .subscribe({
            next: () => {
              console.log('Question deleted:', this.question);
            },
            error: (err) => {
              console.error('Delete failed', err);
            },
          });
      }
    });
  }
}
