import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  // Durée d'inactivité avant déconnexion (5 minutes = 300000 ms)
  private readonly timeoutDuration = 300000;

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.startMonitoring();
  }

  /**
   * Démarre la surveillance de l'inactivité de l'utilisateur.
   */
  public startMonitoring(): void {
    this.ngZone.runOutsideAngular(() => {
      // Écouter les événements d'activité utilisateur (mouvement de souris, clavier)
      const userActivity$ = merge(
        fromEvent(window, 'mousemove'),
        fromEvent(window, 'keydown')
      );

      // Repartir un timer à chaque activité détectée
      const inactivityTimer$ = userActivity$.pipe(
        tap(() => console.log('Activité détectée, réinitialisation du timer')),
        switchMap(() => timer(this.timeoutDuration))
      );

      // Lorsque le timer atteint la durée limite, déconnecter l'utilisateur
      inactivityTimer$.subscribe(() => {
        this.ngZone.run(() => {
          console.log("Inactivité détectée, déconnexion de l'utilisateur");
          this.authService.logout();
          alert("Vous avez été déconnecté en raison de l'inactivité.");
          this.router.navigate(['/login']);
        });
      });
    });
  }
}
