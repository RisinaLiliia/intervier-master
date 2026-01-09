import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { take } from 'rxjs';

import { QuestionItem } from '../../models/question.model';
import { QuestionsService } from '../../services/questions.service';
import { AuthFacade } from '../../core/auth/auth.facade';
import { AuthRequiredModalComponent } from '../auth-required-modal/auth-required.modal';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-questions-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit {

  questions: QuestionItem[] = [];
  displayedColumns = ['position', 'question', 'actions'];
  isLoading = false;

  constructor(
    private questionsService: QuestionsService,
    private auth: AuthFacade,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.isLoading = true;
    this.questionsService.getByCategory("1").subscribe({ 
      next: q => {
        this.questions = q;
        this.isLoading = false;
      },
      error: () => (this.isLoading = false)
    });
  }


}
