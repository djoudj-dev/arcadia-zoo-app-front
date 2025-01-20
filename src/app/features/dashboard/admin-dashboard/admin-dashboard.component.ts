import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { StatsComponent } from './stats-board/stats.component';

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
  imports: [RouterOutlet, CommonModule, StatsComponent],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  /** Liste des éléments de navigation disponibles */
  navigationItems: NavigationItem[] = [
    {
      text: 'Statistiques',
      route: '',
      description: 'Voir les statistiques du zoo',
    },
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

  constructor(readonly router: Router) {
    // Initialise l'onglet actif en fonction de la route courante
    const currentRoute = this.router.url.split('/').pop();
    this.activeRoute.set(currentRoute === 'admin' ? '' : currentRoute ?? '');
  }

  /**
   * Navigue vers une section spécifique du tableau de bord
   * @param route Chemin de route vers lequel naviguer
   */
  navigateTo(route: string): void {
    if (route === '') {
      this.activeRoute.set('');
      this.router.navigate(['/admin']);
    } else {
      this.activeRoute.set(route);
      this.router.navigate(['/admin', route]);
    }
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

  getIcon(text: string): string {
    const iconMap: { [key: string]: string } = {
      Statistiques: 'fa-chart-bar',
      Animaux: 'fa-paw',
      Habitats: 'fa-tree',
      Services: 'fa-concierge-bell',
      Comptes: 'fa-users',
      "Horaires d'ouverture": 'fa-clock',
      'Rapports vétérinaires': 'fa-stethoscope',
      'Historique des actions': 'fa-history',
    };
    return iconMap[text] || 'fa-circle';
  }
}
