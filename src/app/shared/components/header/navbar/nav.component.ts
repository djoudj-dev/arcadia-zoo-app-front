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
  userRoles$!: Observable<{ [key: string]: boolean }>;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Utilisation de l'observable pour suivre l'état d'authentification
    this.userAuthenticated$ = this.authService.currentUser$.pipe(
      map((user) => user !== null)
    );

    // Utilisation de l'observable pour vérifier dynamiquement les rôles
    this.userRoles$ = this.authService.currentUser$.pipe(
      map((user) => {
        const roles: { [key: string]: boolean } = {
          admin: false,
          vétérinaire: false,
        };

        if (user && user.role && user.role.name) {
          roles[user.role.name.toLowerCase()] = true; // Assurez-vous que role.name existe avant d'appeler toLowerCase()
        }

        return roles;
      })
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
}
