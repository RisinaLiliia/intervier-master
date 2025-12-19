import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuestionItem } from '../models/question.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PreparationService {
  private readonly baseUrl = 'http://localhost:3000/questions';

  constructor(private http: HttpClient) {}

  getPreparationQuestionsByCategory(
    categoryName: string
  ): Observable<QuestionItem[]> {
    return this.http.get<QuestionItem[]>(
      `${this.baseUrl}?category=${categoryName}`
    );
  }

  updateAnswer(id: number, answer: string): Observable<QuestionItem> {
    return this.http.patch<QuestionItem>(`${this.baseUrl}/${id}`, { answer });
  }

  deleteAnswer(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}`, { answer: '' });
  }
}
