import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CountResourceComponent } from './stats-board/counts-resource/count-resource.component';

/** Interface pour les éléments de navigation */
interface NavigationItem {
  text: string;
  route: string;
  description?: string;
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
    {
      text: 'Animaux',
      route: 'animal-management',
      description: 'Gérer les animaux du zoo',
    },
    {
      text: 'Habitats',
      route: 'habitat-management',
      description: 'Gérer les habitats des animaux',
    },
    {
      text: 'Services',
      route: 'service-management',
      description: 'Gérer les services du zoo',
    },
    {
      text: 'Comptes',
      route: 'account-management',
      description: 'Gérer les comptes utilisateurs',
    },
    {
      text: "Horaires d'ouverture",
      route: 'opening-hours-management',
      description: 'Gérer les horaires du zoo',
    },
    {
      text: 'Rapports vétérinaires',
      route: 'veterinary-reports',
      description: 'Consulter les rapports vétérinaires',
    },
    {
      text: 'Historique des actions',
      route: 'history-management',
      description: "Consulter l'historique des actions",
    },
  ];

  /** Signal pour l'onglet actif */
  activeRoute = signal<string>('');

  constructor(private router: Router) {
    // Initialise l'onglet actif en fonction de la route courante
    this.activeRoute.set(this.router.url.split('/').pop() || '');
  }

  /**
   * Navigue vers une section spécifique du tableau de bord
   * @param route Chemin de route vers lequel naviguer
   */
  navigateTo(route: string): void {
    this.activeRoute.set(route);
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
    return this.activeRoute() === route;
  }
}
