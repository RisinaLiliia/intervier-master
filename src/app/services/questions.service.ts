import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../environments/environment';
import { QuestionItem } from '../models/question.model';

@Injectable({ providedIn: 'root' })
export class QuestionsService {
  private readonly api = `${environment.apiUrl}/questions`;

  constructor(private http: HttpClient) {}

  getQuestions(categoryId: string, userId?: string) {
  return this.http.get<QuestionItem[]>(`${this.api}?categoryId=${categoryId}`, { withCredentials: true }).pipe(
    map(questions => questions.map(q => {
      const userAnswer = q.answers.find(a => a.userId === userId);
      const defaultAnswer = q.answers.find(a => !a.userId);
      return { ...q, displayedAnswer: userAnswer ?? defaultAnswer! };
    }))
  );
}

upsertAnswer(questionId: string, answer: string) {
  return this.http.post<{ _id: string }>(`${this.api}/${questionId}`, { answer }, { withCredentials: true });
}

deleteAnswer(questionId: string) {
  return this.http.delete(`${this.api}/${questionId}`, { withCredentials: true });
}

}

