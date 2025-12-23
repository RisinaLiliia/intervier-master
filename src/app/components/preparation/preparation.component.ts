import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {  MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { take } from 'rxjs';
import { QuestionItem } from '../../models/question.model';
import { QuestionsService } from '../../services/questions.service';
import { AuthFacade } from '../../core/auth.facade';
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
    this.route.queryParams.subscribe(params => {
      const categoryId = Number(params['categoryId']);
      this.isLoading = true;

      this.questionsService.getByCategory(categoryId).subscribe({
        next: q => {
          this.questions = q;
          this.isLoading = false;
        },
        error: () => (this.isLoading = false)
      });
    });
  }

  openEditDialog(question: QuestionItem): void {
    this.auth.isAuth$.pipe(take(1)).subscribe(isAuth => {
      if (!isAuth) {
        this.dialog.open(AuthRequiredModalComponent);
        return;
      }

      this.dialog.open(EditAnswerModalComponent, {
        width: '600px',
        data: question
      });
    });
  }
}

