import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { TopMenuComponent } from '../components/top-menu/top-menu.component';
import { LeftSideMenuComponent } from '../components/left-side-menu/left-side-menu.component';
import { UserPanelComponent } from '../components/user-panel/user-panel.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Category } from '../services/categories.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    TopMenuComponent,
    LeftSideMenuComponent,
    UserPanelComponent,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

  categories: Category[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const data = this.route.snapshot.data['categories'];
    if (data) this.categories = data;
  }
}
