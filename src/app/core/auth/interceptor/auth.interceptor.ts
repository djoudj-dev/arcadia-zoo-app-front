import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../../token/token.service';
import { AuthService } from '../../auth/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AlertService } from '../../alert/service/alert.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const alertService = inject(AlertService);

  const token = tokenService.getToken();
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      console.error('Erreur dans l’intercepteur:', error);
      if (error.status === 401 || error.status === 403) {
        alertService.showAlert(
          'Votre session a expiré. Vous avez été déconnecté.'
        );
        authService.logout(); // Gère la redirection et la déconnexion
      }
      return throwError(error);
    })
  );
};
