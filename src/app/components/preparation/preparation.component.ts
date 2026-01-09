import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { take } from 'rxjs';

import { QuestionItem } from '../../models/question.model';
import { QuestionsService } from '../../services/questions.service';
import { AuthFacade } from '../../core/auth/auth.facade';
import { AuthRequiredModalComponent } from '../auth-required-modal/auth-required.modal';
import { EditAnswerModalComponent } from '../edit-answer-modal/edit-answer-modal.component';

@Component({
  selector: 'app-preparation',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './preparation.component.html',
  styleUrls: ['./preparation.component.scss']
})
export class PreparationComponent implements OnInit {

  questions: QuestionItem[] = [];
  displayedColumns: string[] = ['position', 'question', 'actions'];
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private questionsService: QuestionsService,
    private auth: AuthFacade,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(take(1)).subscribe(params => {
      const categoryId = params['categoryId'] as string;
      if (!categoryId) return;

      this.loadQuestions(categoryId);
    });
  }

  private loadQuestions(categoryId: string) {
    this.isLoading = true;

    this.questionsService.getByCategory(categoryId).subscribe({
      next: (questions) => {
        this.questions = questions;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;

        if (err.status === 401) {
          this.dialog.open(AuthRequiredModalComponent);
        } else {
          console.error('Error loading questions:', err);
        }
      }
    });
  }

  openEditDialog(question: QuestionItem): void {
    this.auth.isAuth$.pipe(take(1)).subscribe({
      next: (isAuth) => {
        if (!isAuth) {
          this.dialog.open(AuthRequiredModalComponent);
          return;
        }

        this.dialog.open(EditAnswerModalComponent, {
          width: '600px',
          data: question
        });
      }
    });
  }
}


