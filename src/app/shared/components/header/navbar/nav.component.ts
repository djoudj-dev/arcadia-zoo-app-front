import { Component, OnInit } from '@angular/core';
import { BannerComponent } from '../banner/banner.component';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { map, Observable } from 'rxjs';
import { Role } from '../../../../core/models/role.model';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [BannerComponent, CommonModule, RouterLink],
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit {
  isMenuOpen = false;
  userAuthenticated$!: Observable<boolean>;
  userHasRoles$!: Observable<{ [key: string]: boolean }>;
  isAdmin = false;
  isVeterinaire = false;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Utilisation de l'observable pour suivre l'état d'authentification
    this.userAuthenticated$ = this.authService.currentUser$.pipe(
      map((user) => user !== null)
    );

    // Utilisation de l'observable pour vérifier dynamiquement les rôles
    this.authService.currentUser$
      .pipe(
        map((user) => {
          const roles: { [key: string]: boolean } = {
            admin: false,
            vétérinaire: false,
          };
          if (user) {
            user.role.forEach((role: Role) => {
              roles[role.name.toLowerCase()] = true;
            });
          }
          this.isAdmin = roles['admin'];
          this.isVeterinaire = roles['vétérinaire'];
        })
      )
      .subscribe(); // Utilisez .subscribe() pour alimenter les propriétés `isAdmin` et `isVeterinaire`
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
