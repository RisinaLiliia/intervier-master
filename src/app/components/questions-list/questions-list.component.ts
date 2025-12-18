import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';


@Component({
  selector: 'app-questions-list',
  standalone: true,
  imports: [MatDialogModule, HttpClientModule, DeleteConfirmationModalComponent],
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent {
  questions = [
    { id: 1, text: 'First question' },
    { id: 2, text: 'Second question' },
  ];

  constructor(private dialog: MatDialog, private http: HttpClient) {}

  deleteQuestion(id: number) {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.http.delete(`http://localhost:3000/questions/${id}`).subscribe({
          next: () => {
            console.log('Deleted!');
            this.questions = this.questions.filter(q => q.id !== id);
          },
          error: (err) => console.error('Delete failed', err),
        });
      }
    });
  }
}
