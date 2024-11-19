import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Feature } from 'app/features/dashboard/admin-dashboard/service-management/model/feature.model';
import { Service } from 'app/features/dashboard/admin-dashboard/service-management/model/service.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ServiceService } from '../service/service.service';

/**
 * Composant de détail d'un service
 * Affiche les informations détaillées d'un service et ses caractéristiques
 */
@Component({
  standalone: true,
  imports: [ButtonComponent],
  selector: 'app-service',
  templateUrl: './service.component.html',
})
export class ServiceComponent implements OnInit {
  /** Signal contenant les données du service */
  service = signal<Service | null>(null);

  /** Signal contenant les caractéristiques du service */
  features = signal<Feature[]>([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService
  ) {}

  /** Initialise le composant en chargeant les données du service */
  ngOnInit() {
    this.loadService();
  }

  /**
   * Charge les informations du service et ses caractéristiques
   */
  private loadService(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.serviceService.getServiceById(id).subscribe({
        next: (data) => {
          if (data) {
            this.service.set(data);
            // Extraction et traitement des caractéristiques
            this.features.set(
              data.features
                ? (data.features.map((item) =>
                    'feature' in item ? item.feature : item
                  ) as Feature[])
                : []
            );
          } else {
            console.error('Service non trouvé');
          }
        },
        error: (error) =>
          console.error('Erreur lors du chargement du service:', error),
      });
    }
  }

  /** Navigue vers la page d'accueil */
  goBack(): void {
    this.router.navigate(['/']);
  }
}
