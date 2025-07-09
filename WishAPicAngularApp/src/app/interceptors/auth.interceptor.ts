import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';
import { AuthResponse } from '../models/auth-response';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<AuthResponse | null> = new BehaviorSubject<AuthResponse | null>(null);

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Don't add token to auth endpoints
    if (request.url.includes('login') || request.url.includes('register')) {
      return next.handle(request);
    }

    const token = localStorage.getItem('token');
    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.accountService.postGenerateNewToken().pipe(
        switchMap((response: AuthResponse) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response);
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          return next.handle(this.addToken(request, response.token));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.accountService.getLogout().subscribe();
          this.router.navigate(['/auth']);
          return throwError(() => err);
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter(response => response !== null),
      take(1),
      switchMap(response => {
        return next.handle(this.addToken(request, response!.token));
      })
    );
  }
}
