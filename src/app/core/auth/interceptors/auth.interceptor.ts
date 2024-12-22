import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { TokenService } from '../../token/token.service';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Injection des services nécessaires
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  // Récupération du token
  const token = tokenService.getToken();

  // Clone de la requête avec l'en-tête Authorization si le token existe
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
    : req.clone({ withCredentials: true });

  // Gestion des erreurs
  return next(authReq).pipe(
    catchError((error) => {
      console.error('Erreur dans l’intercepteur:', error);

      // Ignorer les erreurs pour les statuts 201
      if (error.status === 201) {
        console.warn('Statut 201 ignoré');
        return next(authReq); // Continuer sans échec
      }

      // Gestion des erreurs 401 ou 403
      if (error.status === 401 || error.status === 403) {
        if (!req.url.includes('auth/token/refresh')) {
          return authService.refreshToken().pipe(
            switchMap((newToken) => {
              console.log('Nouveau token récupéré:', newToken);
              tokenService.setToken(newToken.accessToken);
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken.accessToken}`,
                },
              });
              return next(retryReq);
            }),
            catchError((refreshError) => {
              console.error('Échec du rafraîchissement:', refreshError);
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        }
      }

      return throwError(() => error);
    })
  );
};
