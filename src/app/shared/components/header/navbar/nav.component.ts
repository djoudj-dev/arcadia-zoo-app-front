import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UpdatePasswordComponent } from 'app/features/dashboard/admin-dashboard/account-management/update-password.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { ModalComponent } from '../../../components/modal/modal.component';
import { BannerComponent } from '../banner/banner.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    BannerComponent,
    CommonModule,
    RouterLink,
    ModalComponent,
    UpdatePasswordComponent,
  ],
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit {
  isMenuOpen = false;
  activeDropdown: string | null = null;
  isPasswordModalOpen = false;

  userAuthenticated = computed(() => !!this.authService.currentUserSignal());
  userRoles = computed(() => {
    const user = this.authService.currentUserSignal();
    return {
      admin: !!(user && user.role && user.role.name === 'Admin'),
      veterinaire: !!(user && user.role && user.role.name === 'Veterinaire'),
      employe: !!(user && user.role && user.role.name === 'Employe'),
    };
  });

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

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

  // Ferme le dropdown quand on clique en dehors
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.activeDropdown = null;
    }
  }
}
