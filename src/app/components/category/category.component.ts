import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { QuestionItem } from '../../models/question.model';
import { MatDialog } from '@angular/material/dialog';
import { EditAnswerModalComponent } from '../edit-answer-modal/edit-answer-modal.component';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { ActivatedRoute } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['position', 'question', 'actions'];
  dataSource = new MatTableDataSource<QuestionItem>();
  category: string = '';
  isLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private categoriesService: CategoriesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        switchMap((param) => {
          this.category = param.get('categoryId') || '';
          this.isLoading = true;
          return this.categoriesService.getQuestionsByCategory(this.category);
        })
      )
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.dataSource.data = response.data;
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error loading questions:', err);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateAnswer(questionId: number, answer: string) {
    this.categoriesService
      .updateCategoryQuestionById(this.category, { answer }, questionId)
      .subscribe({
        next: (updated) => {
          const index = this.dataSource.data.findIndex((q) => q.id === questionId);
          if (index > -1) {
            this.dataSource.data[index].answer = answer;
          }
          console.log('Answer updated:', updated);
        },
        error: (err) => console.error('Error updating answer:', err),
      });
  }

  deleteAnswer(question: QuestionItem) {
    this.categoriesService
      .deleteCategoryQuestionById(this.category, question.id)
      .subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter((q) => q.id !== question.id);
          console.log('Question deleted:', question);
        },
        error: (err) => console.error('Error deleting question:', err),
      });
  }

  openGenerateDialog(question: QuestionItem): void {
    const dialogRef = this.dialog.open(EditAnswerModalComponent, {
      width: '500px',
      data: {
        question: question.question,
        answer: question.answer,
      },
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        this.updateAnswer(question.id, result);
      }
    });
  }

  openDeleteDialog(question: QuestionItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent, {
      width: '333px',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.deleteAnswer(question);
      }
    });
  }
}
