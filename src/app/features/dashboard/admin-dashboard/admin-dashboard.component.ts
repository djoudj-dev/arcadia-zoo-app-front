import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CountResourceComponent } from './stats-board/counts-resource/count-resource.component';

/**
 * Interface définissant la structure des éléments de navigation
 */
interface NavigationItem {
  /** Texte à afficher pour l'élément de navigation */
  text: string;
  /** Chemin de route pour la navigation */
  route: string;
}

/**
 * Composant principal du tableau de bord administrateur
 * Gère la navigation et l'affichage des différentes sections d'administration
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [ButtonComponent, CountResourceComponent, RouterOutlet],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  /** Liste des éléments de navigation disponibles */
  navigationItems: NavigationItem[] = [
    { text: 'Animaux', route: 'animal-management' },
    { text: 'Habitats', route: 'habitat-management' },
    { text: 'Services', route: 'service-management' },
    { text: 'Comptes', route: 'account-management' },
    {
      text: "Horaires d'ouverture",
      route: 'opening-hours-management',
    },
    { text: 'Rapports vétérinaires', route: 'veterinary-reports' },
    { text: 'Historique des actions', route: 'history-management' },
  ];

  constructor(private router: Router) {}

  /**
   * Navigue vers une section spécifique du tableau de bord
   * @param route Chemin de route vers lequel naviguer
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

  /**
   * Vérifie si la route donnée est active
   * @param route Route à vérifier
   * @returns boolean indiquant si la route est active
   */
  isActiveRoute(route: string): boolean {
    return this.router.url === `/admin/${route}`;
  }
}
