import { Component, OnInit } from '@angular/core';
import { Service } from '../../core/models/service.model'; // Import du service
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router, RouterLink } from '@angular/router';
import { ServiceService } from './service/service.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
  templateUrl: './services.component.html',
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];

  constructor(
    private serviceService: ServiceService, // Injection du service
    private router: Router
  ) {}

  ngOnInit(): void {
    // Utilisation du service pour récupérer la liste des services
    this.serviceService.getServices().subscribe((data) => {
      this.services = data;
    });
  }

  // Méthode pour retourner à la page d'accueil
  goBack(): void {
    this.router.navigate(['/']);
  }
}
