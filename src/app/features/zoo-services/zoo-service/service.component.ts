import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Service } from '../../../core/models/service.model';
import { Feature } from '../../../core/models/feature.model';
import { ServiceService } from '../service/service.service';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  selector: 'app-service',
  templateUrl: './service.component.html',
})
export class ServiceComponent implements OnInit {
  service: Service | null = null;
  features: Feature[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.serviceService.getServiceById(id).subscribe((data) => {
        if (data) {
          this.service = data;

          // Utilisation d'un type de garde pour vérifier et extraire les caractéristiques
          this.features = data.features.map(
            (item: Feature | { feature: Feature }) =>
              'feature' in item ? item.feature : item
          );

          console.log('Service trouvé :', this.service);
          console.log('Caractéristiques du service :', this.features);
        } else {
          console.error('Service non trouvé');
        }
      });
    } else {
      console.error('ID de service non valide');
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
