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
  // Durée maximale d'inactivité avant la déconnexion automatique (5 minutes)
  private readonly timeoutDuration = 300000;
  private inactivitySubscription!: Subscription; // Stocke la souscription active pour la gestion de l'inactivité

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
    private alertService: AlertService // Injection de AlertService pour afficher des alertes
  ) {}

  /**
   * Démarre la surveillance de l'inactivité utilisateur.
   */
  public startMonitoring(): void {
    // Sauvegarde de la souscription pour permettre l'arrêt de la surveillance
    this.inactivitySubscription = this.ngZone.runOutsideAngular(() => {
      // Détection des événements d'activité utilisateur (souris, clavier)
      const userActivity$ = merge(
        fromEvent(window, 'mousemove'),
        fromEvent(window, 'keydown')
      );

      // Redémarrage du timer à chaque activité utilisateur détectée
      const inactivityTimer$ = userActivity$.pipe(
        tap(() => console.log('Activité détectée, réinitialisation du timer')),
        switchMap(() => timer(this.timeoutDuration))
      );

      // Déclenchement de la déconnexion lorsque la durée d'inactivité est atteinte
      return inactivityTimer$.subscribe(() => {
        this.ngZone.run(() => {
          console.log("Inactivité détectée, déconnexion de l'utilisateur");

          // Déconnexion et redirection vers la page de connexion
          this.authService.logout();
          this.alertService.setAlert(
            "Vous avez été déconnecté en raison de l'inactivité."
          ); // Affichage de l'alerte via AlertService
          this.router.navigate(['/login']);
        });
      });
    });
  }

  /**
   * Arrête la surveillance de l'inactivité utilisateur.
   */
  public stopMonitoring(): void {
    if (this.inactivitySubscription) {
      this.inactivitySubscription.unsubscribe();
      console.log("Surveillance d'inactivité arrêtée.");
    }
  }
}
