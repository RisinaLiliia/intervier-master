import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { Category } from '../../services/categories.service';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';

@Component({
  selector: 'app-left-side-menu',
  standalone: true,
  imports: [MatListModule, RouterModule, CapitalizePipe], 
  templateUrl: './left-side-menu.component.html'
})
export class LeftSideMenuComponent {
  @Input() categories: Category[] = [];
}
