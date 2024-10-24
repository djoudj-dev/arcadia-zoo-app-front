import { Component, OnInit } from '@angular/core';
import { TokenService } from './core/token/token.service';
import { AuthService } from './core/auth/auth.service';
import { NavComponent } from './shared/components/header/navbar/nav.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './core/alert/alert.component';
import { InactivityService } from './core/services/inactivity.service';
import { AlertService } from './core/alert/service/alert.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavComponent, FooterComponent, RouterOutlet, AlertComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private inactivityService: InactivityService,
    private alertService: AlertService // Injecter le service d'alerte
  ) {}

  ngOnInit(): void {
    // Vérifier si le token est expiré et déconnecter l'utilisateur si nécessaire
    if (this.tokenService.isTokenExpired()) {
      this.authService.logout(); // Déconnecter l'utilisateur
      this.alertService.showAlert(
        'Votre session a expiré, vous avez été déconnecté.'
      );
    }

    // Démarrer la surveillance de l'inactivité de l'utilisateur
    this.inactivityService.startMonitoring(); // Le service commence à surveiller l'inactivité
  }
}
