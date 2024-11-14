import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs'; // Importer Subscription
import { AlertComponent } from './core/alert/alert.component';
import { AlertService } from './core/alert/service/alert.service';
import { AuthService } from './core/auth/auth.service';
import { InactivityService } from './core/services/inactivity.service';
import { TokenService } from './core/token/token.service';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NavComponent } from './shared/components/header/navbar/nav.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavComponent,
    FooterComponent,
    RouterOutlet,
    AlertComponent,
    ToastComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private inactivitySubscription!: Subscription; // Stocker la souscription

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private inactivityService: InactivityService,
    private alertService: AlertService // Injecter le service d'alerte
  ) {}

  ngOnInit(): void {
    const token = this.tokenService.getToken(); // Récupérer le token

    // Vérifier si le token est présent, ce qui signifie que l'utilisateur est connecté
    if (token) {
      if (this.tokenService.isTokenExpired()) {
        this.authService.logout(); // Déconnecter l'utilisateur si le token est expiré
        this.alertService.setAlert(
          'Votre session a expiré, vous avez été déconnecté.'
        );
      } else {
        // Démarrer la surveillance de l'inactivité SEULEMENT pour les utilisateurs connectés
        this.inactivityService.startMonitoring(); // Démarrer la surveillance
      }
    } else {
      console.log("Aucun token trouvé, l'utilisateur est un visiteur.");
      // Ne pas démarrer la surveillance d'inactivité pour les visiteurs
    }
  }

  ngOnDestroy(): void {
    // Arrêter la surveillance lors de la destruction du composant
    this.inactivityService.stopMonitoring();
  }
}
