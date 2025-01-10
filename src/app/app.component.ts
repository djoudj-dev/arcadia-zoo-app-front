import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/services/auth.service';
import { InactivityService } from './core/services/inactivity.service';
import { TokenService } from './core/token/token.service';
import { NotificationComponent } from './features/contact/notification.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NavComponent } from './shared/components/header/navbar/nav.component';
import { ToastService } from './shared/components/toast/services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavComponent, FooterComponent, RouterOutlet, NotificationComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authService: AuthService,
    private readonly inactivityService: InactivityService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    const token = this.tokenService.getToken();

    if (token) {
      if (this.tokenService.isTokenExpired(token)) {
        this.authService.logout();
        this.toastService.showError(
          'Votre session a expiré, vous avez été déconnecté.'
        );
      } else {
        this.inactivityService.startMonitoring();
      }
    }
  }

  ngOnDestroy(): void {
    this.inactivityService.stopMonitoring();
  }
}
