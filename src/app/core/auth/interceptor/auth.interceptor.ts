import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../../../shared/components/toast/services/toast.service';
import { TokenService } from '../../token/token.service';
import { AuthService } from '../auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Injection des services nécessaires
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  // Récupération du token d'authentification à partir du TokenService
  const token = tokenService.getToken();

  // Clone de la requête avec en-tête Authorization si le token existe
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
    : req.clone({ withCredentials: true });

  // Gestion de la requête suivante et traitement des erreurs
  return next(authReq).pipe(
    catchError((error) => {
      console.error("Erreur dans l'intercepteur:", error);

      if (error.status === 401 || error.status === 403) {
        toastService.showError(
          'Votre session a expiré. Vous avez été déconnecté.'
        );
        authService.logout();
      }

      return throwError(() => error);
    })
  );
};
