// src/app/admin-dashboard/stats/stats.component.ts
import { Component, OnInit } from '@angular/core';
import { VisitStatsComponent } from '../visit-stats/visit-stats.component';
import { CountResourceService } from './services/count-resource.service';

/**
 * Composant d'affichage des statistiques des ressources
 * Affiche les compteurs pour les différentes ressources du zoo
 */
@Component({
  standalone: true,
  selector: 'app-count-resource',
  imports: [VisitStatsComponent],
  templateUrl: './count-resource.component.html',
})
export class CountResourceComponent implements OnInit {
  constructor(public countResourceService: CountResourceService) {}

  ngOnInit() {
    this.loadCountResource();
  }

  /**
   * Charge les statistiques depuis le service
   * Met à jour les compteurs et affiche les notifications
   */
  loadCountResource() {
    this.countResourceService.getStats().subscribe({
      next: () => {
        // Traitement des statistiques
      },
      error: (error) => {
        console.error(
          'Erreur lors de la récupération des statistiques:',
          error
        );
      },
    });
  }
}
