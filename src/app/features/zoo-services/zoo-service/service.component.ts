import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from '../../../core/models/service.model'; // Import du service
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './service.component.html',
  styles: [
    `
      span {
        font-weight: bold;
      }
    `,
  ],
})
export class ServiceComponent implements OnInit {
  service: Service | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService // Injection du service
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Utilisation du service pour récupérer un service spécifique
    this.serviceService.getServiceById(id).subscribe((data) => {
      this.service = data;
    });
  }

  // Retour à la page d'accueil
  goBack(): void {
    this.router.navigate(['/']);
  }
}
