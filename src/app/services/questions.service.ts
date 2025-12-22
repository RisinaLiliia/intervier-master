
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuestionItem } from '../models/question.model';

@Injectable({ providedIn: 'root' })
export class QuestionsService {
  private api = 'http://localhost:3000/questions';

  constructor(private http: HttpClient) {}

  getByCategory(categoryId: number) {
    return this.http.get<QuestionItem[]>(
      `${this.api}?categoryId=${categoryId}`
    );
  }

  update(id: number, answer: string) {
    return this.http.patch(`${this.api}/${id}`, { answer });
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
