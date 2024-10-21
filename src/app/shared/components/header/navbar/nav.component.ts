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
    // Utilisation de l'observable pour suivre l'état d'authentification
    this.userAuthenticated$ = this.authService.currentUser$.pipe(
      map((user) => !!user) // Transforme l'utilisateur en booléen
    );

    // Utilisation de l'observable pour vérifier dynamiquement les rôles
    this.userRoles$ = this.authService.currentUser$.pipe(
      map((user) => ({
        admin: !!(user && user.role && user.role.name === 'admin'),
        veterinaire: !!(user && user.role && user.role.name === 'vétérinaire'),
      }))
    );
  }

  // Gérer l'ouverture et la fermeture du menu
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Gérer la déconnexion
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    let isAuthenticated = false;
    this.userAuthenticated$.subscribe((auth) => (isAuthenticated = auth));
    return isAuthenticated;
  }

  // Vérifier si l'utilisateur a un rôle spécifique
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
