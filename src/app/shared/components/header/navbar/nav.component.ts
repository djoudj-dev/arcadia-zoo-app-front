import { CommonModule } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { BannerComponent } from '../banner/banner.component';

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

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
