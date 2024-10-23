import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SlicePipe } from '@angular/common';
import { Service } from '../../../core/models/service.model';
import { ServiceManagementService } from '../service/service.management.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Feature } from '../../../core/models/feature.model';

@Component({
  selector: 'app-service-management',
  standalone: true,
  imports: [ButtonComponent, SlicePipe, ReactiveFormsModule, FormsModule],
  templateUrl: './service-management.component.html',
  styleUrls: ['./service-management.component.css'],
})
export class ServiceManagementComponent implements OnInit {
  serviceList: Service[] = [];
  features: Feature[] = [];
  displayedServiceList: {
    id: number;
    name: string;
    description: string;
    image: string;
    showFullDescription: boolean;
  }[] = [];
  newService: Partial<Service> = {}; // Stocke les données du nouveau service

  constructor(private serviceManagement: ServiceManagementService) {}

  ngOnInit() {
    this.loadServices();
    this.loadFeatures();
  }

  // Charger les services depuis le backend
  loadServices() {
    this.serviceManagement.getAllServices().subscribe((services: Service[]) => {
      this.serviceList = services;
      this.displayedServiceList = this.serviceList.map((service) => ({
        ...service,
        showFullDescription: false, // Ajouter showFullDescription pour gérer l'affichage
      }));
    });
  }

  // Charger les caractéristiques disponibles depuis le backend
  loadFeatures() {
    this.serviceManagement.getAllFeatures().subscribe((features: Feature[]) => {
      this.features = features;
    });
  }

  // Gestion de l'image du service
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

  // Création d'un service
  createService() {
    console.log('Données du nouveau service:', this.newService);

    const { name, description, location, hours, image, features } =
      this.newService;
    if (name && description && location && hours && image && features) {
      this.serviceManagement
        .createService({
          ...this.newService,
        } as Service)
        .subscribe(
          (createdService) => {
            this.serviceList.push(createdService);
            this.newService = {};
            this.loadServices(); // Recharger la liste des services
          },
          (error) => {
            console.error('Erreur lors de la création du service:', error);
          }
        );
    } else {
      console.log('Veuillez remplir tous les champs');
    }
  }

  // Mise à jour d'un service
  updateService() {
    const { name, description, location, hours, image, features, id } =
      this.newService;
    if (name && description && location && hours && image && features && id) {
      this.serviceManagement
        .updateService({
          ...this.newService,
        } as Service)
        .subscribe(() => {
          console.log('Service mis à jour');
          this.newService = {};
          this.loadServices(); // Recharger la liste des services
        });
    } else {
      console.log('Veuillez remplir tous les champs');
    }
  }

  // Suppression d'un service
  deleteService(serviceId: number) {
    this.serviceManagement.deleteService(serviceId).subscribe(
      () => {
        console.log('Service supprimé');
        this.serviceList = this.serviceList.filter(
          (service) => service.id !== serviceId
        );
        this.loadServices(); // Recharger la liste des services
      },
      (error) => {
        console.error('Erreur lors de la suppression du service:', error);
      }
    );
  }

  // Gestion dynamique de l'affichage des descriptions
  toggleDescription(serviceId: number) {
    const service = this.displayedServiceList.find((s) => s.id === serviceId);
    if (service) {
      service.showFullDescription = !service.showFullDescription;
    }
  }

  // Annuler l'édition ou la création du service
  cancel() {
    this.newService = {};
  }
}
