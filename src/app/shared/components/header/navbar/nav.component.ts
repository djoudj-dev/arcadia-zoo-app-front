import {
  Component,
  computed,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { LoginFormComponent } from '../../../components/login-form/login-form.component';
import { ModalComponent } from '../../../components/modal/modal.component';
import { PasswordResetComponent } from '../../../components/password-reset/password-reset.component';
import { BannerComponent } from '../banner/banner.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterLink,
    ModalComponent,
    LoginFormComponent,
    BannerComponent,
    PasswordResetComponent,
  ],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  isMenuOpen = false;
  activeDropdown: string | null = null;
  readonly isLoginModalOpen = signal(false);
  readonly isPasswordResetModalOpen = signal(false);

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

  openLoginModal(): void {
    this.isLoginModalOpen.set(true);
  }

  closeLoginModal(): void {
    this.isLoginModalOpen.set(false);
  }

  openPasswordResetModal(): void {
    this.isLoginModalOpen.set(false);
    this.isPasswordResetModalOpen.set(true);
  }

  closePasswordResetModal(): void {
    this.isPasswordResetModalOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // Ferme le dropdown quand on clique en dehors
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Vérifie si le clic est sur un bouton de menu hamburger
    const isMenuToggleClick = target.closest('#menu-toggler');
    // Vérifie si c'est un clic sur un bouton de sous-menu
    const isDropdownToggleClick = target.closest(
      'button[class*="hover:text-quaternary"]'
    );

    // Si c'est un clic sur le bouton hamburger ou un bouton de sous-menu, on ne fait rien
    if (isMenuToggleClick || isDropdownToggleClick) {
      return;
    }

    // Vérifie si le clic est dans la zone de navigation
    const isClickInNavigation =
      target.closest('#main-navlist-mobile') || target.closest('#main-nav');

    // Si le clic est en dehors de la navigation, on ferme tout
    if (!isClickInNavigation) {
      this.isMenuOpen = false;
      this.activeDropdown = null;
      return;
    }

    // Si le clic est sur un lien de navigation (mais pas un bouton), on ferme le menu
    if (target.closest('a')) {
      this.isMenuOpen = false;
      this.activeDropdown = null;
    }
  }
}
