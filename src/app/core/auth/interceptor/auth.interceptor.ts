import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../../token/token.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AlertService } from '../../alert/service/alert.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const alertService = inject(AlertService); // Utiliser le nouvel AlertService

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
      if (error.status === 401 || error.status === 403) {
        // Gérer la déconnexion et afficher le message d'alerte
        authService.logout();
        alertService.showAlert(
          'Votre session a expiré. Vous avez été déconnecté.'
        );
        router.navigate(['/login']); // Redirige vers la page de connexion
      }
      return throwError(error);
    })
  );
};
