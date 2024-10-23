import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SERVICES } from '../../../core/mocks/services-mock.component';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-service-management',
  standalone: true,
  imports: [ButtonComponent, SlicePipe],
  templateUrl: './service-management.component.html',
  styleUrls: ['./service-management.component.css'], // "styleUrls" pour le CSS
})
export class ServiceManagementComponent {
  serviceList = SERVICES; // Utilisé pour afficher les services
  displayedServiceList = this.serviceList.map((service) => ({
    ...service,
    showFullDescription: false, // Ajout de showFullDescription pour chaque service
  }));

  editService() {
    // Logique pour modifier le service
  }

  deleteService() {
    // Logique pour supprimer le service
  }

  toggleDescription(serviceId: number) {
    // Alterne l'état de l'affichage de la description complète
    const service = this.displayedServiceList.find((s) => s.id === serviceId);
    if (service) {
      service.showFullDescription = !service.showFullDescription;
    }
  }
}
