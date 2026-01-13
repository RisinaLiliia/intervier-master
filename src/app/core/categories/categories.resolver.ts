import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { Category } from './category.model';
import { CategoryService } from './categories.service';

export const CategoriesResolver: ResolveFn<Category[]> = () => {
  const categoryService = inject(CategoryService);
  return categoryService.getAll();
};
