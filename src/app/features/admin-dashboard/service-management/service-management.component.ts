import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SlicePipe } from '@angular/common';
import { Service } from '../../../core/models/service.model';
import { ServiceManagementService } from '../service/service.management.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Feature } from '../../../core/models/feature.model';
import { environment } from '../../../../environments/environment.development';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-management',
  standalone: true,
  imports: [ButtonComponent, SlicePipe, ReactiveFormsModule, FormsModule],
  templateUrl: './service-management.component.html',
})
export class ServiceManagementComponent implements OnInit {
  serviceList: Service[] = [];
  features: Feature[] = [];
  displayedServiceList: {
    id: number;
    name: string;
    description: string;
    image: string;
    location: string;
    hours: string;
    features: Feature[];
    showFullDescription: boolean;
  }[] = [];
  newService: Partial<Service> = { features: [] }; // Stocke les données du nouveau service
  selectedFile: File | null = null;

  constructor(
    private router: Router,
    private serviceManagement: ServiceManagementService
  ) {}

  ngOnInit() {
    this.loadServices();
    this.loadFeatures();
  }

  isFeatureSelected(feature: Feature): boolean {
    return this.newService.features?.some((f) => f.id === feature.id) ?? false;
  }

  // Méthode appelée lorsqu'une case à cocher est sélectionnée ou désélectionnée
  onFeatureChange(feature: Feature, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    // Assurez-vous que features est initialisé comme un tableau
    if (!this.newService.features) {
      this.newService.features = [];
    }

    if (isChecked) {
      // Ajouter la caractéristique sélectionnée (vérifier qu'elle n'existe pas déjà)
      if (!this.newService.features.some((f) => f.id === feature.id)) {
        this.newService.features.push(feature);
      }
    } else {
      // Supprimer la caractéristique désélectionnée
      this.newService.features = this.newService.features.filter(
        (f) => f.id !== feature.id
      );
    }
    console.log(this.newService.features);
  }

  // Charger les services depuis le backend
  loadServices() {
    this.serviceManagement.getAllServices().subscribe((services: Service[]) => {
      this.serviceList = services;
      this.displayedServiceList = this.serviceList.map((service) => ({
        ...service,
        image: `${environment.apiUrl}/uploads/${service.image}`,
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
      this.selectedFile = file; // Met à jour la variable selectedFile
      const reader = new FileReader();
      reader.onload = () => {
        this.newService.image = reader.result as string; // Facultatif si vous affichez une prévisualisation
      };
      reader.readAsDataURL(file);
    } else {
      console.error('Aucun fichier sélectionné.');
    }
  }

  // Création d'un service
  createService() {
    console.log('Données du nouveau service:', this.newService);

    // Extraire les propriétés du nouveau service
    const { name, description, location, hours, features } = this.newService;

    // Vérification des champs obligatoires
    if (
      name &&
      description &&
      location &&
      hours &&
      features &&
      features.length > 0
    ) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('hours', hours);

      // Convertir les caractéristiques en tableau d'ID avant de les ajouter
      const featureIds = features.map((feature: Feature) => feature.id);
      formData.append('features', JSON.stringify(featureIds)); // Envoyer uniquement les IDs des caractéristiques

      // Ajouter l'image si elle est sélectionnée
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      // Observer pour gérer les résultats de la requête HTTP
      const observer = {
        next: (createdService: Service) => {
          this.serviceList.push(createdService); // Ajouter le service à la liste locale
          this.newService = {}; // Réinitialiser le formulaire
          this.selectedFile = null; // Réinitialiser l'image sélectionnée
          this.loadServices(); // Recharger la liste des services
        },
        error: (error: Service) => {
          console.error('Erreur lors de la création du service:', error);
        },
        complete: () => {
          console.log('Création du service complétée.');
        },
      };

      // Appel au service pour créer le service
      this.serviceManagement.createService(formData).subscribe(observer);
    } else {
      console.log('Veuillez remplir tous les champs obligatoires.');
    }
  }

  // Mise à jour d'un serviceprivate router: Router, private tokenService: TokenService
  updateService() {
    const { name, description, location, hours, features, id } =
      this.newService;

    if (name && description && location && hours && features && id) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('hours', hours);
      formData.append('features', JSON.stringify(features)); // Convertir les features en string JSON

      if (this.selectedFile) {
        formData.append('image', this.selectedFile); // Ajouter l'image si elle a été modifiée
      }

      this.serviceManagement.updateService(id, formData).subscribe(
        () => {
          console.log('Service mis à jour');
          this.newService = {};
          this.selectedFile = null;
          this.loadServices(); // Recharger la liste des services
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du service:', error);
        }
      );
    } else {
      console.log('Veuillez remplir tous les champs');
    }
  }

  // Remplir le formulaire de mise à jour avec les données du service sélectionné
  editService(serviceId: number) {
    const service = this.serviceList.find((s) => s.id === serviceId);
    if (service) {
      this.newService = { ...service };
      // Assure-toi que les caractéristiques du service sont bien assignées
      this.newService.features = service.features || [];
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
    this.selectedFile = null;
  }

  // Retour a l'accueil dashboard
  goBack() {
    this.router.navigate(['/admin']);
  }
}
