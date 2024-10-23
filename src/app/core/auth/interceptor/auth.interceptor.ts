import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log("Token dans l'intercepteur:", token); // Vérifie le token ici

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  console.log(
    'Requête modifiée avec en-tête:',
    authReq.headers.get('Authorization')
  );

  return next(authReq);
};
