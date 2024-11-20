// src/app/admin-dashboard/stats/stats.component.ts
import { Component, OnInit } from '@angular/core';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { ToastComponent } from '../../../../../shared/components/toast/toast.component';
import { CountResourceService } from './services/count-resource.service';

/**
 * Composant d'affichage des statistiques des ressources
 * Affiche les compteurs pour les différentes ressources du zoo
 */
@Component({
  standalone: true,
  selector: 'app-count-resource',
  imports: [ToastComponent],
  templateUrl: './count-resource.component.html',
})
export class CountResourceComponent implements OnInit {
  constructor(
    public countResourceService: CountResourceService,
    private toastService: ToastService
  ) {}

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
        console.table([
          {
            animaux: this.countResourceService.totalAnimals(),
            habitats: this.countResourceService.totalHabitats(),
            services: this.countResourceService.totalServices(),
            employes: this.countResourceService.totalEmploye(),
            veterinaires: this.countResourceService.totalVet(),
          },
        ]);
      },
      error: (error) => {
        console.error(
          'Erreur lors de la récupération des statistiques:',
          error
        );
        this.toastService.showError(
          'Erreur lors du chargement des statistiques'
        );
      },
    });
  }
}
