import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenSecurityService } from 'app/core/token/token-security.service';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenSecurityService);
  const router = inject(Router);

  const token = tokenService.getToken();

  if (!token) {
    console.warn('Aucun token trouvé');
    authService.logout();
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  return true;
};
