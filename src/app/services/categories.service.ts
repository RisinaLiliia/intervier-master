import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { CategoryItem, QuestionItem, ResponseArray } from '../models/question.model';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  private getCategoryByName(name: string): Observable<CategoryItem> {
    return this.http
      .get<CategoryItem[]>(`${this.apiUrl}/categories?name=${name}`)
      .pipe(map((categories) => categories[0]));
  }

  getQuestionsByCategory(categoryName: string): Observable<ResponseArray<QuestionItem>> {
    return this.getCategoryByName(categoryName).pipe(
      switchMap((category) =>
        this.http.get<QuestionItem[]>(
          `${this.apiUrl}/questions?categoryId=${category.id}`
        )
      ),
      map((questions) => ({ data: questions }))
    );
  }

  deleteCategoryQuestionById(categoryName: string, questionId: number) {
    return this.http.delete(`${this.apiUrl}/questions/${questionId}`);
  }

  updateCategoryQuestionById(
    categoryName: string,
    payload: Partial<QuestionItem>,
    questionId: number
  ) {
    return this.http.patch(`${this.apiUrl}/questions/${questionId}`, payload);
  }
}

