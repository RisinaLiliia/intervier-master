import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrls: ['./delete-confirmation-modal.component.scss']
})
export class DeleteConfirmationModalComponent {
  constructor(public dialogRef: MatDialogRef<DeleteConfirmationModalComponent>) {}

  cancel() {
    this.dialogRef.close(false);
  }

  deleteQuestion() {
    this.dialogRef.close(true);
  }
}

