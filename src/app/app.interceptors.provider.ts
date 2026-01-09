import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { AuthInterceptor } from './core/auth/auth.interceptor';
import { ErrorInterceptor } from './core/error/error.interceptor';
import { AppComponent } from './app.component';


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([AuthInterceptor, ErrorInterceptor]))
  ]
});
