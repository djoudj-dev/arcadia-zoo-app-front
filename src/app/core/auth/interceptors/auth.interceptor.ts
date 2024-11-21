import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ToastService } from '../../../shared/components/toast/services/toast.service';
import { TokenService } from '../../token/token.service';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Injection des services nécessaires
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  // Récupération du token
  const token = tokenService.getToken();
  console.log('Intercepteur: Token récupéré:', token);

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

      // Gestion des erreurs 401 ou 403
      if (error.status === 401 || error.status === 403) {
        if (tokenService.isTokenExpired()) {
          console.warn('Le token est expiré. Tentative de rafraîchissement...');
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
              console.error(
                'Échec du rafraîchissement du token:',
                refreshError
              );
              toastService.showError(
                'Votre session a expiré. Vous avez été déconnecté.'
              );
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        }

        console.warn('Erreur non liée à un token expiré.');
        toastService.showError(
          'Votre session a expiré. Vous avez été déconnecté.'
        );
        authService.logout();
      }

      return throwError(() => error);
    })
  );
};
