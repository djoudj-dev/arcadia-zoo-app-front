import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SlicePipe } from '@angular/common';
import { Service } from '../../../core/models/service.model';
import { ServiceManagementService } from '../service/service.management.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-service-management',
  standalone: true,
  imports: [ButtonComponent, SlicePipe, ReactiveFormsModule, FormsModule],
  templateUrl: './service-management.component.html',
  styleUrls: ['./service-management.component.css'], // "styleUrls" pour le CSS
})
export class ServiceManagementComponent implements OnInit {
  serviceList: Service[] = [];
  newService: Partial<Service> = {}; // Stocke les données du nouveau service

  constructor(private serviceManagement: ServiceManagementService) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.serviceManagement.getAllServices().subscribe((services: Service[]) => {
      console.log(services);
      this.serviceList = services;
      this.displayedServiceList = this.serviceList.map((service) => ({
        ...service,
        showFullDescription: false, // Ajout de showFullDescription pour chaque service
      }));
    });
  }

  displayedServiceList = this.serviceList.map((service) => ({
    ...service,
    showFullDescription: false, // Ajout de showFullDescription pour chaque service
  }));

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newService.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  createService() {
    console.log('Données du nouveau service:', this.newService);

    const { name, description, image } = this.newService;
    if (name && description && image) {
      this.serviceManagement
        .createService({
          ...this.newService,
          image: image,
        } as Service)
        .subscribe(
          (createdService) => {
            this.serviceList.push(createdService);
            this.newService = {};
          },
          (error) => {
            console.error('Erreur lors de la création du service:', error);
          }
        );
    } else {
      console.log('Veuillez remplir tous les champs');
    }
  }

  updateService() {
    const { name, description, image } = this.newService;

    if (name && description && image) {
      this.serviceManagement
        .updateService({
          ...this.newService,
          image: image,
        } as Service)
        .subscribe(() => {
          console.log('Service mis à jour');
          this.newService = {};
        });
    } else {
      console.log('Veuillez remplir tous les champs');
    }
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

  cancel() {
    this.newService = {};
  }
}
