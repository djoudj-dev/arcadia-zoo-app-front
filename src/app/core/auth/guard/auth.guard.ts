import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { InactivityService } from 'app/core/services/inactivity.service';
import { TokenService } from 'app/core/token/token.service';
import {
  catchError,
  firstValueFrom,
  from,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const inactivityService = inject(InactivityService);

  // Vérification du token
  const token = tokenService.getToken();
  const requiredRoles = route.data['roles'] as string[];

  if (!token) {
    handleAuthError('Aucun token trouvé', router, authService, state.url);
    return of(false);
  }

  // Vérification de l'expiration du token
  if (tokenService.isTokenExpired(token)) {
    return from(refreshAndValidateToken(tokenService, authService)).pipe(
      switchMap((refreshSuccess) => {
        if (!refreshSuccess) {
          handleAuthError('Session expirée', router, authService, state.url);
          return of(false);
        }
        return validateAccess(requiredRoles, authService, router);
      }),
      catchError(() => {
        handleAuthError('Erreur de validation', router, authService, state.url);
        return of(false);
      })
    );
  }

  // Démarrage du monitoring d'inactivité
  inactivityService.startMonitoring();

  return validateAccess(requiredRoles, authService, router);
};

async function refreshAndValidateToken(
  tokenService: TokenService,
  authService: AuthService
): Promise<boolean> {
  try {
    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) return false;

    await firstValueFrom(authService.refreshToken());
    return true;
  } catch {
    return false;
  }
}

function validateAccess(
  requiredRoles: string[],
  authService: AuthService,
  router: Router
): Observable<boolean> {
  if (!requiredRoles?.length) return of(true);

  const userRole = authService.userRole();
  if (!userRole) {
    router.navigate(['/unauthorized']);
    return of(false);
  }

  const hasRequiredRole = requiredRoles.includes(userRole);
  if (!hasRequiredRole) {
    console.warn(`Accès refusé - Rôle requis: ${requiredRoles.join(', ')}`);
    router.navigate(['/unauthorized']);
    return of(false);
  }

  return of(true);
}

function handleAuthError(
  message: string,
  router: Router,
  authService: AuthService,
  returnUrl: string
): void {
  console.warn(`Erreur d'authentification: ${message}`);
  authService.logout();
  router.navigate(['/login'], {
    queryParams: {
      returnUrl,
      error: message,
    },
  });
}
