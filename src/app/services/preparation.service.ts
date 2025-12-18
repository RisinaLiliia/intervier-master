import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';
import { MOCK_DATA, QuestionItem } from '../components/category/category.component.config';
import { Response, ResponseArray } from '../models/response.models';
import { get } from 'lodash';

@Injectable({ providedIn: 'root' })
export class PreparationService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getPreparationQuestionsByCategory(category: string) {
    return this.http.get<ResponseArray<QuestionItem>>(
      `${this.baseUrl}/questions?category=${category}`
    );
  }

  deletePreparationQuestionById(id: number) {
    return this.http.delete(
      `${this.baseUrl}/questions/${id}`
    );
  }
}
