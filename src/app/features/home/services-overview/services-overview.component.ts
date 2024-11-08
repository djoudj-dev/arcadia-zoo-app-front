import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Service } from 'app/features/admin-dashboard/service-management/model/service.model';
import { environment } from 'environments/environment.development';
import { ServiceService } from '../../zoo-services/service/service.service';

@Component({
  selector: 'app-services-overview',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './services-overview.component.html',
})
export class ServicesOverviewComponent implements OnInit {
  services = signal<Service[]>([]);

  constructor(private serviceService: ServiceService) {} // Injection du service

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
}
