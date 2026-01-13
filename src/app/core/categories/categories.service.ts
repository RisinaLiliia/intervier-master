import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Category } from './category.model';
import { QuestionItem } from '../questions/question.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly api = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Category[]>(
      `${this.api}/categories`,
      { withCredentials: true }
    );
  }

  getQuestions(categoryId: string) {
    return this.http.get<QuestionItem[]>(
      `${this.api}/questions`,
      {
        params: { categoryId },
        withCredentials: true,
      }
    );
  }
}
