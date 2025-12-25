import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';

import { QuestionItem } from '../../models/question.model';
import { QuestionsService } from '../../services/questions.service';
import { AuthFacade } from '../../core/auth/auth.facade';
import { AuthRequiredModalComponent } from '../auth-required-modal/auth-required.modal';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-question-item',
  standalone: true,
  template: `
    <div class="question-item">
      <span>{{ question.question }}</span>

      <button mat-button color="warn" (click)="delete()">
        Delete
      </button>
    </div>
  `
})
export class QuestionItemComponent {

  @Input({ required: true }) question!: QuestionItem;

  constructor(
    private questionsService: QuestionsService,
    private auth: AuthFacade,
    private dialog: MatDialog
  ) {}

  delete(): void {
    this.auth.isAuth$.pipe(take(1)).subscribe(isAuth => {
      if (!isAuth) {
        this.dialog.open(AuthRequiredModalComponent);
        return;
      }

      const ref = this.dialog.open(DeleteConfirmationModalComponent);
      ref.afterClosed().subscribe(confirmed => {
        if (confirmed) {
          this.questionsService.delete(this.question.id).subscribe();
        }
      });
    });
  }
}

