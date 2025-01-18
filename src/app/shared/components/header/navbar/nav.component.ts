import {
  Component,
  computed,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { BannerComponent } from '../banner/banner.component';
import { LoginComponent } from '../../../../features/login/login.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, BannerComponent, LoginComponent],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  isMenuOpen = false;
  activeDropdown: string | null = null;
  isPasswordModalOpen = false;
  readonly isLoginModalOpen = signal(false);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  userAuthenticated = computed(() => !!this.authService.user());
  userRoles = computed(() => {
    const user = this.authService.user();
    return {
      admin: user?.role?.name === 'Admin',
      veterinaire: user?.role?.name === 'Veterinaire',
      employe: user?.role?.name === 'Employe',
    };
  });

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown(menu: string): void {
    this.activeDropdown = this.activeDropdown === menu ? null : menu;
  }

  openPasswordModal(): void {
    this.router.navigate(['/update-password']);
    this.activeDropdown = null;
  }

  closePasswordModal(): void {
    this.isPasswordModalOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  openLoginModal(): void {
    this.isLoginModalOpen.set(true);
  }

  closeLoginModal(): void {
    this.isLoginModalOpen.set(false);
  }

  // Ferme le dropdown quand on clique en dehors
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.activeDropdown = null;
    }
  }
}
