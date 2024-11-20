import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ServiceManagementComponent } from '../admin-dashboard/service-management/service-management.component';
import { FeedingDataComponent } from './animal-feeding-management/animal-feeding-management.component';
import { UserOpinionManagementComponent } from './user-opinion-management/user-opinion-management.component';

/** Type pour les onglets disponibles */
type TabType = 'opinions' | 'services' | 'feeding';

/** Interface pour les éléments de navigation */
interface NavigationItem {
  text: string;
  type: TabType;
  description?: string;
}

/**
 * Composant du tableau de bord employé
 * Gère la navigation entre les différentes sections du dashboard
 */
@Component({
  selector: 'app-employe-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    UserOpinionManagementComponent,
    ServiceManagementComponent,
    FeedingDataComponent,
  ],
  templateUrl: './employe-dashboard.component.html',
})
export class EmployeDashboardComponent {
  /** Signal pour l'onglet actif */
  activeTab = signal<TabType>('opinions');

  /** Liste des éléments de navigation */
  navigationItems: NavigationItem[] = [
    {
      text: 'Gestion des avis',
      type: 'opinions',
      description: 'Gérer les avis des visiteurs',
    },
    {
      text: 'Gestion des services',
      type: 'services',
      description: 'Gérer les services du zoo',
    },
    {
      text: "Gestion de l'alimentation",
      type: 'feeding',
      description: "Gérer l'alimentation des animaux",
    },
  ];

  /**
   * Change l'onglet actif
   * @param tab Nouvel onglet à afficher
   */
  setActiveTab(tab: TabType): void {
    this.activeTab.set(tab);
  }
}
