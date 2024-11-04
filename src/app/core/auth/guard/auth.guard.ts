import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { TokenService } from '../../token/token.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Vérifie si le token est présent et valide
  if (!authService.isAuthenticated() || tokenService.isTokenExpired()) {
    console.log(
      'Token expiré ou utilisateur non authentifié, redirection vers la page de connexion.'
    );
    router.navigate(['/login']);
    return false;
  }

  // Récupère les rôles requis depuis les données de la route (si définis)
  const requiredRoles = route.data?.['roles'] as string[];

  // Si des rôles sont requis, vérifie si l'utilisateur possède l'un de ces rôles
  if (
    requiredRoles &&
    (!authService.currentUserSignal() || !authService.hasRole(requiredRoles))
  ) {
    console.log(
      'Accès refusé. Rôles requis:',
      requiredRoles,
      ", Rôle de l'utilisateur:",
      authService.currentUserSignal()?.role?.name
    );
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
