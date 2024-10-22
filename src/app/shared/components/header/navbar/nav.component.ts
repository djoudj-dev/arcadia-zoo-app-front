import { Component, OnInit } from '@angular/core';
import { BannerComponent } from '../banner/banner.component';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [BannerComponent, CommonModule, RouterLink],
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit {
  isMenuOpen = false;
  userAuthenticated$!: Observable<boolean>;
  userRoles$!: Observable<{ admin: boolean; veterinaire: boolean }>;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userAuthenticated$ = this.authService.currentUser$.pipe(
      map((user) => !!user)
    );

    this.userRoles$ = this.authService.currentUser$.pipe(
      map((user) => ({
        admin: !!(user && user.role && user.role.name === 'admin'),
        veterinaire: !!(user && user.role && user.role.name === 'vétérinaire'),
      }))
    );
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    let isAuthenticated = false;
    this.userAuthenticated$.subscribe((auth) => (isAuthenticated = auth));
    return isAuthenticated;
  }

  hasRole(role: string): boolean {
    let hasRole = false;
    this.userRoles$.subscribe((roles) => {
      if (role === 'admin') {
        hasRole = roles.admin;
      } else if (role === 'vétérinaire') {
        hasRole = roles.veterinaire;
      }
    });
    return hasRole;
  }
}
