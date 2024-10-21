import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Injecter le service d'authentification

  // Récupérer le token depuis le service d'authentification
  const token = authService.getToken();

  // Cloner la requête pour y ajouter le header Authorization avec le token
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  // Passer la requête modifiée (ou non modifiée si aucun token)
  return next(authReq);
};
