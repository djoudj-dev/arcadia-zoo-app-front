import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Service } from '../admin-dashboard/service-management/model/service.model';
import { ServiceService } from './service/service.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
  templateUrl: './services.component.html',
})
export class ServicesComponent implements OnInit {
  @Input() services: Service[] = [];

  constructor(
    private serviceService: ServiceService, // Injection du service
    private router: Router
  ) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.serviceService.getServices().subscribe((services) => {
      this.services = services;
    });
  }

  // Méthode pour retourner à la page d'accueil
  goBack(): void {
    this.router.navigate(['/']);
  }
}
