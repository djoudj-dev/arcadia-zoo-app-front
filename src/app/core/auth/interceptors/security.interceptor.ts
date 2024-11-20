import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenResponse } from '../models/token-response.interface';
import { TokenSecurityService } from '../../token/token-security.service';

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private tokenService: TokenSecurityService
  ) {}

  intercept<T>(
    request: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    const token = this.tokenService.getToken();

    if (token) {
      request = this.addSecurityHeaders(request, token);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addSecurityHeaders<T>(
    request: HttpRequest<T>,
    token: string
  ): HttpRequest<T> {
    return request.clone({
      headers: request.headers
        .set('Authorization', `Bearer ${token}`)
        .set('X-Content-Type-Options', 'nosniff')
        .set('X-Frame-Options', 'DENY')
        .set('X-XSS-Protection', '1; mode=block'),
    });
  }

  private handle401Error<T>(
    request: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    return this.authService.refreshToken().pipe(
      switchMap((tokens: TokenResponse) => {
        return next.handle(
          this.addSecurityHeaders(request, tokens.accessToken)
        );
      }),
      catchError((error) => {
        this.authService.logout();
        return throwError(() => error);
      })
    );
  }
}
