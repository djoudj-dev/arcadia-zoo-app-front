import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { CountResourceComponent } from './stats-board/counts-resource/count-resource.component';

/**
 * Interface définissant la structure des éléments de navigation
 * @property text - Le texte à afficher pour l'élément de navigation
 * @property route - Le chemin de route pour la navigation
 */
interface NavigationItem {
  text: string;
  route: string;
}

/**
 * Composant du tableau de bord administrateur
 * Gère la navigation vers les différentes sections d'administration
 */
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonComponent,
    CountResourceComponent,
  ],
})
export class AdminDashboardComponent {
  /**
   * Liste des éléments de navigation disponibles dans le tableau de bord
   */
  navigationItems: NavigationItem[] = [
    { text: 'Gestion des comptes', route: 'admin/account-management' },
    { text: 'Gestion des services', route: 'admin/service-management' },
    { text: 'Gestion des habitats', route: 'admin/habitat-management' },
    { text: 'Gestion des animaux', route: 'admin/animal-management' },
    { text: 'Comptes rendus des vétérinaires', route: 'admin/vet-reports' },
    { text: 'Commentaire sur les habitats', route: 'admin/history-management' },
  ];

  constructor(private router: Router) {}

  /**
   * Navigue vers la route spécifiée
   * @param route - Le chemin de route vers lequel naviguer
   */
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  /**
   * Retourne à la page d'accueil
   */
  goBack(): void {
    this.router.navigate(['/']);
  }
}
