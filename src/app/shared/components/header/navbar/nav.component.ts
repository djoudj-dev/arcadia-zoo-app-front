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
    const dropdownButton = target.closest('button');
    const dropdownContainer = target.closest('.relative');

    // Si le clic n'est pas sur un bouton de menu et n'est pas dans un conteneur de dropdown
    if (!dropdownButton && !dropdownContainer) {
      this.activeDropdown = null;
      this.isMenuOpen = false;
    }
  }
}
