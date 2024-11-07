import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Service } from 'app/features/admin-dashboard/service-management/model/service.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ServiceService } from '../../zoo-services/service/service.service';

@Component({
  selector: 'app-services-overview',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
  templateUrl: './services-overview.component.html',
})
export class ServicesOverviewComponent implements OnInit {
  services: Service[] = [];

  constructor(private serviceService: ServiceService) {} // Injection du service

  ngOnInit(): void {
    // Récupérer les services via le ServiceService
    this.serviceService.getServices().subscribe((data) => {
      this.services = data;
    });
  }
}
