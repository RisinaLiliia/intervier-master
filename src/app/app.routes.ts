import { Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { CategoryComponent } from './components/category/category.component';
import { PreparationComponent } from './components/preparation/preparation.component';
import { AuthGuard } from './core/auth/auth.guard';

import { CategoriesResolver } from './core/categories.resolver';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    resolve: { categories: CategoriesResolver },
    children: [
      { path: 'categories/:categoryId', component: CategoryComponent },
      { path: 'preparation', component: PreparationComponent, canActivate: [AuthGuard] },
      { path: '', redirectTo: '/categories/1', pathMatch: 'full' },
      { path: '**', redirectTo: '/categories/1' }
    ]
  }
];




