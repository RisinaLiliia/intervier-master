import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { Category } from '../../services/categories.service';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';

@Component({
  selector: 'app-top-menu',
  standalone: true,
  imports: [MatTabsModule, CapitalizePipe ],
  templateUrl: './top-menu.component.html'
})
export class TopMenuComponent {

  @Input({ required: true }) categories!: Category[];
  tabIndex = 0;

  constructor(private router: Router) {}

  changeTab(event: MatTabChangeEvent): void {
    const category = this.categories[event.index];
    this.router.navigate(['/categories', category.id]);
  }
}
