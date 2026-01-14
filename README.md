# Frontend Application

Modern Angular application built with **standalone components**, reactive architecture, and secure **cookie-based authentication**.  
Designed for scalability, maintainability, and production-ready security.

---

## Goals

- Fully reactive, standalone Angular components
- Secure authentication & CSRF protection
- Predictable state management via Facade pattern
- Lazy-loaded routing with resolvers
- Clean separation of concerns

---

## Tech Stack

- **Angular (standalone components)** — [https://angular.io/docs](https://angular.io/docs)
- **Angular Router** — [https://angular.io/guide/router](https://angular.io/guide/router)
- **Angular Material** — [https://material.angular.io/](https://material.angular.io/)
- **RxJS** — [https://rxjs.dev/](https://rxjs.dev/)
- **HTTP Interceptors** — [https://angular.io/guide/http#intercepting-requests-and-responses](https://angular.io/guide/http#intercepting-requests-and-responses)
- **JWT (via HttpOnly cookies)**
- **CSRF protection**

---

## Architecture Overview

- **AuthFacade** — Central authentication state, exposes `user$`, `isAuth$`
- **AuthInterceptor** — Handles 401, queues requests during token refresh
- **CSRFInterceptor** — Automatically injects CSRF token into state-changing requests
- **AuthGuard** — Protects routes requiring authentication
- **Facades** — Encapsulate business logic for predictable data flow
- **Resolvers** — Preload route data to avoid flickering

### Architecture Diagram

```text
      Facade
        │
        ▼
     Service
        │
        ▼
      HTTP
        │
        ▼
     Backend
```

---

## Project Structure

```text
src/
├── app/
│   ├── core/
│   │   ├── auth/
│   │   ├── categories/
│   │   ├── questions/
│   │   ├── http/
│   │   └── error/
│   ├── components/
│   ├── pipes/
│   ├── directives/
│   ├── shell/
│   ├── app.routes.ts
│   └── app.config.ts
├── environments/
```

## Environment Configuration

```

# environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};

# environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url/api',
};

```

## Routing & Guards

- `/categories/:categoryId` — Public  
- `/preparation` — Protected (AuthGuard + Resolver)  
- Lazy-loaded modules and route resolvers for fast, responsive navigation  
- Graceful redirects on unauthorized access
  
---

## State Management

- Facade pattern using `BehaviorSubject` (no external state library)  
- Predictable, observable-based data flow  

**Examples:**  
- `AuthFacade`  
- `CategoryFacade`  
- `QuestionsFacade`  

---

### HTTP Interceptors (Execution Order)

1. `CSRFInterceptor` — injects CSRF token
2. `AuthInterceptor` — handles token refresh & request queueing
3. `ErrorInterceptor` — centralized error handling


---

## UI Components

- Standalone Angular components  
- Angular Material dialogs  
- Reactive forms  
- Custom pipes & directives  
- Typing animation directive  

---

## Authentication Flow

- User logs in → backend sets HttpOnly cookies + CSRF token  
- `AuthFacade` updates state (`user$`, `isAuth$`)  
- HTTP interceptors automatically attach tokens for protected requests  
- Access token refresh handled transparently  
- Automatic session recovery on page reload  

---

## Security Notes

- No tokens stored in `localStorage` or `sessionStorage`  
- HttpOnly cookies used with `withCredentials`  
- CSRF token rotation supported  
- Automatic session recovery on reload  
- Auth-required routes fully guarded  

---

## Error Handling

- Centralized error interceptor  
- Material Snackbar notifications for user feedback  
- Graceful fallback on auth/session errors  

---

## Installation & Run

```bash

# Install dependencies
npm install

# Run in development
npm start

# Build for production
npm run build

```

---

## Non-goals

- External state libraries (NgRx, Akita, etc.)
- Server-side rendering (SSR)
- OAuth/social login

---

## License

MIT
