import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CategoriesService {

  private api = 'http://localhost:3000/categories';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.api);
  }

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.api}/${id}`);
  }
}
