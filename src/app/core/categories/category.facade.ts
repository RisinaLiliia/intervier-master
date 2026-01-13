import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

import { CategoryService } from './categories.service';
import { Category } from './category.model';

@Injectable({ providedIn: 'root' })
export class CategoryFacade {
  private readonly categoriesSubject = new BehaviorSubject<Category[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);

  readonly categories$ = this.categoriesSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();

  constructor(private categoryService: CategoryService) {}

  loadCategories(): void {
    this.loadingSubject.next(true);

    this.categoryService
      .getAll()
      .pipe(
        tap(categories => this.categoriesSubject.next(categories)),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe({
        error: err => {
          console.error('[CategoryFacade] loadCategories error', err);
          this.categoriesSubject.next([]);
        }
      });
  }
}
