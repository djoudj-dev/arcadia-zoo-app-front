import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router, RouterLink } from '@angular/router';
import { ServiceService } from './service/service.service';
import { Service } from '../admin-dashboard/service-management/model/service.model';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
  templateUrl: './services.component.html',
})
export class ServicesComponent implements OnInit {
  serviceList: Service[] = [];

  constructor(
    private serviceService: ServiceService, // Injection du service
    private router: Router
  ) {}

  ngOnInit(): void {
    // Utilisation du service pour récupérer la liste des services
    this.serviceService.getServices().subscribe((data) => {
      this.serviceList = data;
    });
  }

  // Méthode pour retourner à la page d'accueil
  goBack(): void {
    this.router.navigate(['/']);
  }
}
