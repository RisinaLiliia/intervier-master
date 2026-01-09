import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { Category } from '../models/category.model';
import { QuestionItem } from '../models/question.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${this.apiUrl}/categories`,
      { withCredentials: true }
    );
  }

  getQuestions(categoryId: string): Observable<QuestionItem[]> {
    return this.http.get<QuestionItem[]>(
      `${this.apiUrl}/questions`,
      {
        params: { categoryId },
        withCredentials: true,
      }
    );
  }
}


