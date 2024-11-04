import { Component, OnInit, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BannerComponent } from '../banner/banner.component';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [BannerComponent, CommonModule, RouterLink],
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit {
  isMenuOpen = false;
  userAuthenticated = computed(() => !!this.authService.currentUserSignal());
  userRoles = computed(() => {
    const user = this.authService.currentUserSignal();
    return {
      admin: !!(user && user.role && user.role.name === 'Admin'),
      veterinaire: !!(user && user.role && user.role.name === 'Veterinaire'),
      employe: !!(user && user.role && user.role.name === 'Employe'),
    };
  });

  constructor(public authService: AuthService, private router: Router) {
    effect(() => {
      const user = this.authService.currentUserSignal();
      console.log('Utilisateur actuel dans NavComponent:', user);
      const roles = this.userRoles();
      console.log('Rôles après le subscribe dans NavComponent:', roles);
    });
  }

  ngOnInit(): void {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
