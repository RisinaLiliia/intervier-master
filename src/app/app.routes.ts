import { Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { CategoryComponent } from './components/category/category.component';
import { PreparationComponent } from './components/preparation/preparation.component';
import { authGuard } from './core/auth/auth.guard';
import { CategoriesResolver } from './core/categories.resolver';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    resolve: { categories: CategoriesResolver },
    children: [
      {
        path: 'categories/:categoryId',
        component: CategoryComponent
      },
      {
        path: 'preparation',
        component: PreparationComponent,
        canActivate: [authGuard]
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'categories'
      },
      {
        path: '**',
        redirectTo: 'categories'
      }
    ]
  }
];







