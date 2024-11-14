import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { environment } from 'environments/environment.development';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Service } from '../dashboard/admin-dashboard/service-management/model/service.model';
import { ServiceService } from './service/service.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
  templateUrl: './services.component.html',
})
export class ServicesComponent implements OnInit {
  services = signal<Service[]>([]);

  constructor(
    private serviceService: ServiceService, // Injection du service
    private router: Router
  ) {}

  ngOnInit() {
    this.loadServices();
  }

  // Méthode pour charger les services
  loadServices() {
    this.serviceService.getServices().subscribe((data) => {
      // Formate l'URL de l'image de chaque service et met à jour le signal
      this.services.set(
        data.map((service) => ({
          ...service,
          images: service.images.startsWith('http')
            ? service.images
            : `${environment.apiUrl}/${service.images}`,
        }))
      );
    });
  }

  // Méthode pour retourner à la page d'accueil
  goBack(): void {
    this.router.navigate(['/']);
  }
}
