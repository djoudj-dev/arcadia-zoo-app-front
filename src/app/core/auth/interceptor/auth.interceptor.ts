import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TokenService } from '../../token/token.service';
import { AuthService } from '../auth.service';
import { AlertService } from '../../alert/service/alert.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Injection des services nécessaires
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const alertService = inject(AlertService);

  // Récupération du token d'authentification à partir du TokenService
  const token = tokenService.getToken();

  // Clone de la requête avec en-tête Authorization si le token existe
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  // Gestion de la requête suivante et traitement des erreurs
  return next(authReq).pipe(
    catchError((error) => {
      console.error('Erreur dans l’intercepteur:', error);

      // Si l'erreur est liée à l'authentification (401 ou 403)
      if (error.status === 401 || error.status === 403) {
        // Déclenchement d'une alerte utilisateur pour session expirée
        alertService.setAlert(
          'Votre session a expiré. Vous avez été déconnecté.'
        );

        // Déconnexion et redirection via AuthService
        authService.logout();
      }

      // Renvoie de l'erreur pour être gérée en aval si nécessaire
      return throwError(() => error);
    })
  );
};
