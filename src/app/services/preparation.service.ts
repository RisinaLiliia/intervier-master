import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionItem } from '../models/question.model';
import { ResponseArray } from '../models/response.models';

@Injectable({ providedIn: 'root' })
export class PreparationService {
  private baseUrl = 'http://localhost:3000/questions';

  constructor(private http: HttpClient) {}

  getPreparationQuestionsByCategory(category: string): Observable<ResponseArray<QuestionItem>> {
    return this.http.get<ResponseArray<QuestionItem>>(`${this.baseUrl}?category=${category}`);
  }

  deletePreparationQuestionById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updatePreparationQuestionById(id: number, question: Partial<QuestionItem>): Observable<QuestionItem> {
    return this.http.patch<QuestionItem>(`${this.baseUrl}/${id}`, question);
  }
}

