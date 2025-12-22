import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { take } from 'rxjs';
import { QuestionItem } from '../../models/question.model';
import { QuestionsService } from '../../services/questions.service';
import { AuthFacade } from '../../core/auth.facade';
import { AuthRequiredModalComponent } from '../auth-required-modal/auth-required.modal';
import { EditAnswerModalComponent } from '../edit-answer-modal/edit-answer-modal.component';

@Component({
  standalone: true,
  selector: 'app-category',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  questions: QuestionItem[] = [];
  displayedColumns: string[] = ['position', 'question', 'actions'];
  isLoading = false;

  private categoryId!: number;

  constructor(
    private route: ActivatedRoute,
    private questionsService: QuestionsService,
    private auth: AuthFacade,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    this.categoryId = Number(params.get('categoryId'));
    this.isLoading = true;
    this.questionsService.getByCategory(this.categoryId).subscribe({
      next: q => {
        this.questions = q;
        this.isLoading = false;
      },
      error: () => (this.isLoading = false)
    });
  });
}


  openGenerateDialog(question: QuestionItem): void {
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
