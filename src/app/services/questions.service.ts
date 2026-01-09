import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { QuestionItem } from '../models/question.model';

@Injectable({ providedIn: 'root' })
export class QuestionsService {
  private api = environment.apiUrl + '/answers';

  constructor(private http: HttpClient) {}

  getByCategory(categoryId: string): Observable<QuestionItem[]> {
    return this.http.get<QuestionItem[]>(
      `${environment.apiUrl}/questions?categoryId=${categoryId}`
    );
  }

  createAnswer(questionId: string, answer: string) {
    return this.http.post(
      `${this.api}/${questionId}`,
      { answer },
      { withCredentials: true }
    );
  }

  updateAnswer(questionId: string, answerId: string, answer: string) {
    return this.http.patch(
      `${this.api}/${questionId}/${answerId}`,
      { answer },
      { withCredentials: true }
    );
  }

  deleteAnswer(questionId: string, answerId: string) {
    return this.http.delete(
      `${this.api}/${questionId}/${answerId}`,
      { withCredentials: true }
    );
  }
}
