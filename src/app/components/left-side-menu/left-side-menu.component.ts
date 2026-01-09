import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { Category } from '../../models/category.model';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-left-side-menu',
  standalone: true,
  imports: [CommonModule,  MatListModule, RouterModule, CapitalizePipe], 
  templateUrl: './left-side-menu.component.html'
})
export class LeftSideMenuComponent {
  @Input() categories: Category[] = [];
}
