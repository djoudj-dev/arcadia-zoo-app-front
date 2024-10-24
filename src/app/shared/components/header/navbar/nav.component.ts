import { Component, OnInit } from '@angular/core';
import { BannerComponent } from '../banner/banner.component';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [BannerComponent, CommonModule, RouterLink],
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit {
  isMenuOpen = false;
  userAuthenticated$!: Observable<boolean>;
  userRoles$!: Observable<{
    admin: boolean;
    veterinaire: boolean;
    employe: boolean;
  }>;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Observable pour vérifier l'authentification de l'utilisateur
    this.userAuthenticated$ = this.authService.currentUser$.pipe(
      map((user) => !!user)
    );

    // Observable pour vérifier les rôles de l'utilisateur
    this.userRoles$ = this.authService.currentUser$.pipe(
      map((user) => {
        const roles = {
          admin: !!(user && user.role && user.role.name === 'Admin'), // Accès à user.role.name
          veterinaire: !!(
            user &&
            user.role &&
            user.role.name === 'Vétérinaire'
          ), // Accès à user.role.name
          employe: !!(user && user.role && user.role.name === 'Employé'), // Accès à user.role.name
        };
        return roles;
      }),
      catchError(() => of({ admin: false, veterinaire: false, employe: false }))
    );

    // Ajouter un subscribe pour vérifier si l'Observable change bien
    this.userRoles$.subscribe((roles) => {
      console.log('Rôles après le subscribe dans NavComponent:', roles);
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
