import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { TokenService } from '../../token/token.service';
import { AuthService } from '../services/auth.service';

export const WHITELISTED_URLS = [
  '/api/auth/login',
  '/api/auth/refresh',
  '/api/public',
] as const;

/**
 * Intercepteur HTTP pour gérer l'authentification automatique des requêtes
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  if (WHITELISTED_URLS.some((url) => req.url.includes(url))) {
    return next(req);
  }

  return next(addTokenToRequest(req, tokenService)).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Unauthorized) {
        return handleUnauthorizedError(error, authService, req, next);
      }
      return throwError(() => ({
        ...error,
        message: `Erreur lors de la requête: ${error.message}`,
        timestamp: new Date().toISOString(),
      }));
    })
  );
};

/**
 * Gère les erreurs 401 en tentant de rafraîchir le token
 * Déconnecte l'utilisateur si le rafraîchissement échoue
 */
function handleUnauthorizedError(
  error: HttpErrorResponse,
  authService: AuthService,
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const tokenService = inject(TokenService);
  return authService.refreshToken().pipe(
    switchMap(() => next(addTokenToRequest(req, tokenService))),
    catchError((refreshError) => {
      authService.logout();
      return throwError(() => ({
        ...refreshError,
        message: 'Session expirée. Veuillez vous reconnecter.',
        timestamp: new Date().toISOString(),
      }));
    })
  );
}

/**
 * Ajoute le token d'authentification à la requête
 */
function addTokenToRequest(
  req: HttpRequest<unknown>,
  tokenService: TokenService
): HttpRequest<unknown> {
  const token = tokenService.getToken();
  return token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'X-Request-ID': crypto.randomUUID(),
        },
        withCredentials: true,
      })
    : req.clone({ withCredentials: true });
}
