import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthFacade } from './core/auth/auth.facade';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  constructor(private auth: AuthFacade) {}

  ngOnInit() {
    this.auth.initSession();
  }
}


