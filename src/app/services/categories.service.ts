import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../environments/environment';
import { Category } from '../models/category.model';
import { QuestionItem } from '../models/question.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}


  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`, {
      withCredentials: true
    }).pipe(
      catchError(err => {
        console.error('Error fetching categories', err);
        return of([]);
      })
    );
  }

  getQuestions(categoryId: string, userId?: string): Observable<QuestionItem[]> {
    return this.http.get<QuestionItem[]>(`${this.apiUrl}/questions`, {
      params: { categoryId },
      withCredentials: true
    }).pipe(
      map(questions =>
        questions.map(q => {
          const userAnswer = q.answers.find(a => a.userId === userId);

          const defaultAnswer = q.answers.find(a => !a.userId);

      
          const displayedAnswer = userAnswer ?? defaultAnswer ?? { text: '', userId: undefined };

          return {
            ...q,
            displayedAnswer
          };
        })
      ),
      catchError(err => {
        console.error(`Error fetching questions for category ${categoryId}`, err);
        return of([]); 
      })
    );
  }
}



