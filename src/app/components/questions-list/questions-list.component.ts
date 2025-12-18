import { Component, OnInit } from '@angular/core';
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
export class QuestionsListComponent implements OnInit {
  questions: any[] = [];

  constructor(private dialog: MatDialog, private http: HttpClient) {}

ngOnInit() {
  this.http.get<any[]>('http://localhost:3000/questions').subscribe({
    next: (data) => {
      console.log('Questions loaded:', data);
      this.questions = data;
    },
    error: (err) => console.error('Error loading questions:', err)
  });
}


  loadQuestions() {
    this.http.get<any[]>('http://localhost:3000/questions').subscribe({
      next: (data) => this.questions = data,
      error: (err) => console.error('Failed to load questions', err)
    });
  }

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

