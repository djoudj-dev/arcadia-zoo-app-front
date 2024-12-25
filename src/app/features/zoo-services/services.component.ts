import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { environment } from 'environments/environment';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Service } from '../dashboard/admin-dashboard/service-management/model/service.model';
import { ServiceService } from './service/service.service';

/**
 * Composant listant tous les services
 * Affiche une grille des services disponibles dans le zoo
 */
@Component({
  selector: 'app-services',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
  templateUrl: './services.component.html',
})
export class ServicesComponent implements OnInit {
  /** Signal pour stocker la liste des services */
  services = signal<Service[]>([]);

  constructor(private serviceService: ServiceService, private router: Router) {}

  /** Initialise le composant en chargeant la liste des services */
  ngOnInit() {
    this.loadServices();
  }

  /**
   * Charge tous les services depuis le service
   * Formate les URLs des images pour l'affichage
   */
  private loadServices() {
    this.serviceService.getServices().subscribe({
      next: (data) => {
        this.services.set(
          data.map((service) => ({
            ...service,
            images:
              service.images?.startsWith('http') || false
                ? service.images
                : `${environment.apiUrl}/api/${service.images}`,
          }))
        );
      },
      error: (error) =>
        console.error('Erreur lors du chargement des services:', error),
    });
  }

  /** Navigue vers la page d'accueil */
  goBack(): void {
    this.router.navigate(['/']);
  }
}
