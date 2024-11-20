import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenSecurityService } from 'app/core/token/token-security.service';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenSecurityService);
  const router = inject(Router);

  const token = tokenService.getToken();

  if (!token || !tokenService.isTokenValid(token)) {
    console.warn('Session invalide ou expirée');
    authService.logout();
    router.navigate(['/login'], {
      queryParams: { returnUrl: route.url.join('/') },
    });
    return false;
  }

  const requiredRoles = route.data?.['roles'] as string[];
  if (requiredRoles && !authService.hasRequiredRoles(requiredRoles)) {
    console.warn('Accès non autorisé');
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
