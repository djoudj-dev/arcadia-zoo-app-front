import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { ToastComponent } from '../../../components/toast/toast.component';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  templateUrl: './banner.component.html',
})
export class BannerComponent {
  constructor(private readonly authService: AuthService) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
  }
}
