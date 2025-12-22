import { inject } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { ResolveFn } from '@angular/router';

export const CategoriesResolver: ResolveFn<any[]> = () => {
  const categoriesService = inject(CategoriesService);
  return categoriesService.getAll();
};

