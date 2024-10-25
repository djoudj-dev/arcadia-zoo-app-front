import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, timer, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { AlertService } from '../alert/service/alert.service'; // Import du AlertService

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  // Durée d'inactivité avant déconnexion (5 minutes = 300000 ms)
  private readonly timeoutDuration = 300000;
  private inactivitySubscription!: Subscription; // Sauvegarde de la souscription

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
    private alertService: AlertService // Inject AlertService
  ) {}

  /**
   * Démarre la surveillance de l'inactivité de l'utilisateur.
   */
  public startMonitoring(): void {
    // Sauvegarder la souscription pour pouvoir la stopper si nécessaire
    this.inactivitySubscription = this.ngZone.runOutsideAngular(() => {
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
      return inactivityTimer$.subscribe(() => {
        this.ngZone.run(() => {
          console.log("Inactivité détectée, déconnexion de l'utilisateur");
          this.authService.logout();
          this.alertService.showAlert(
            "Vous avez été déconnecté en raison de l'inactivité."
          ); // Utiliser AlertService
          this.router.navigate(['/login']);
        });
      });
    });
  }

  /**
   * Arrête la surveillance de l'inactivité de l'utilisateur.
   */
  public stopMonitoring(): void {
    if (this.inactivitySubscription) {
      this.inactivitySubscription.unsubscribe();
      console.log("Surveillance d'inactivité arrêtée.");
    }
  }
}
