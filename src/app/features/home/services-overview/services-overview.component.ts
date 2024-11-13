import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Service } from 'app/features/admin-dashboard/service-management/model/service.model';
import { environment } from 'environments/environment.development';
import { ServiceService } from '../../zoo-services/service/service.service';

@Component({
  selector: 'app-services-overview',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './services-overview.component.html',
})
export class ServicesOverviewComponent implements OnInit {
  services = signal<Service[]>([]);
  loading = signal<boolean>(true);
  imageStates = signal<Map<number, boolean>>(new Map());

  constructor(private serviceService: ServiceService) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.loading.set(true);
    this.serviceService.getServices().subscribe({
      next: (data) => {
        this.services.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des services:', error);
        this.loading.set(false);
      },
    });
  }

  onImageLoad(serviceId: number) {
    const currentStates = new Map(this.imageStates());
    currentStates.set(serviceId, true);
    this.imageStates.set(currentStates);
  }

  isImageLoaded(serviceId: number): boolean {
    return this.imageStates()?.get(serviceId) ?? false;
  }

  getImageUrl(url: string): string {
    if (!url) return '/assets/images/placeholder.jpg';
    return url.startsWith('http') ? url : `${environment.apiUrl}/api/${url}`;
  }
}
