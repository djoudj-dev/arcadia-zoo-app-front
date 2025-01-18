import {
  Component,
  computed,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { LoginFormComponent } from '../../../../features/login/login-form/login-form.component';
import { ModalComponent } from '../../../components/modal/modal.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, ModalComponent, LoginFormComponent],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  isMenuOpen = false;
  activeDropdown: string | null = null;
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

  openLoginModal(): void {
    this.isLoginModalOpen.set(true);
  }

  closeLoginModal(): void {
    this.isLoginModalOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
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
