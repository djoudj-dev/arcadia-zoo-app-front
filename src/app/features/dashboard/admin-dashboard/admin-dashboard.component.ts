import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
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
  standalone: true,
  imports: [
    ButtonComponent,
    CountResourceComponent,
    CountResourceComponent,
    RouterOutlet,
  ],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  /**
   * Liste des éléments de navigation disponibles dans le tableau de bord
   */
  navigationItems: NavigationItem[] = [
    { text: 'Gestion des animaux', route: 'animal-management' },
    { text: 'Gestion des habitats', route: 'habitat-management' },
    { text: 'Gestion des services', route: 'service-management' },
    { text: 'Gestion des comptes', route: 'account-management' },
    {
      text: "Gestion des horaires d'ouverture",
      route: 'opening-hours-management',
    },
    { text: 'Rapports vétérinaires', route: 'veterinary-reports' },
    { text: 'Historique des actions', route: 'history-management' },
  ];

  constructor(private router: Router) {}

  /**
   * Navigue vers la route spécifiée
   * @param route - Le chemin de route vers lequel naviguer
   */
  navigateTo(route: string): void {
    this.router.navigate(['/admin', route]);
  }

  /**
   * Retourne à la page d'accueil
   */
  goBack(): void {
    this.router.navigate(['/']);
  }
}
