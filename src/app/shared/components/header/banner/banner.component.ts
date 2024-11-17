import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../../core/auth/auth.service';
import { LogoutToastComponent } from './logout-toast.component';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule, LogoutToastComponent],
  templateUrl: './banner.component.html',
})
export class BannerComponent {
  constructor(private authService: AuthService) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
  }
}
