import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Service } from 'app/features/dashboard/admin-dashboard/service-management/model/service.model';
import { environment } from 'environments/environment.development';
import { ServiceService } from '../../zoo-services/service/service.service';

/**
 * Composant d'aperçu des services sur la page d'accueil
 * Affiche une grille des services disponibles dans le zoo
 */
@Component({
  selector: 'app-services-overview',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './services-overview.component.html',
})
export class ServicesOverviewComponent implements OnInit {
  /** Injection du DestroyRef pour la gestion des souscriptions */
  private destroyRef = inject(DestroyRef);

  /** Signal contenant la liste des services */
  services = signal<Service[]>([]);

  constructor(private serviceService: ServiceService) {}

  /** Initialise le composant en chargeant la liste des services */
  ngOnInit() {
    this.loadServices();
  }

  /**
   * Charge tous les services depuis le service
   * Utilise takeUntilDestroyed pour la gestion automatique des souscriptions
   */
  private loadServices(): void {
    this.serviceService
      .getServices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.services.set(data.map(this.formatServiceImage));
        },
        error: (error) =>
          console.error('Erreur lors du chargement des services:', error),
      });
  }

  /**
   * Formate l'URL de l'image d'un service
   * @param service - Le service dont l'image doit être formatée
   * @returns Le service avec l'URL de l'image formatée
   */
  private formatServiceImage(service: Service): Service {
    return {
      ...service,
      images:
        service.images?.startsWith('http') || false
          ? service.images
          : `${environment.apiUrl}/api/${service.images}`,
    };
  }
}
