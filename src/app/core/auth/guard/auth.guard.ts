import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Vérifie si l'utilisateur est authentifié
  if (!authService.isAuthenticated()) {
    console.log(
      'Utilisateur non authentifié, redirection vers la page de connexion.'
    );
    router.navigate(['/login']);
    return false;
  }

  // Récupère les rôles requis depuis les données de la route (si définis)
  const requiredRoles = route.data?.['roles'] as string[];

  // Si des rôles sont requis, vérifie si l'utilisateur possède l'un de ces rôles
  if (requiredRoles && !authService.hasRole(requiredRoles)) {
    console.log(
      'Accès refusé. Rôles requis:',
      requiredRoles,
      ", Rôles de l'utilisateur:",
      authService.currentUser$
    );
    router.navigate(['/unauthorized']); // Redirige si l'utilisateur n'a pas les rôles requis
    return false;
  }

  return true;
};
