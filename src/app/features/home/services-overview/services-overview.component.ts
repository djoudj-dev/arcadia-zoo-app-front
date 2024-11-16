import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Service } from 'app/features/dashboard/admin-dashboard/service-management/model/service.model';
import { environment } from 'environments/environment.development';
import { ServiceService } from '../../zoo-services/service/service.service';

@Component({
  selector: 'app-services-overview',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './services-overview.component.html',
})
export class ServicesOverviewComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  services = signal<Service[]>([]);

  constructor(private serviceService: ServiceService) {}

  ngOnInit() {
    this.loadServices();
  }

  private loadServices(): void {
    this.serviceService
      .getServices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.services.set(data.map(this.formatServiceImage));
      });
  }

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
