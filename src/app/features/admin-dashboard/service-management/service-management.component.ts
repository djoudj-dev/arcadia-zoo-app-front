import { DatePipe, SlicePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { environment } from 'environments/environment.development';
import { ServiceManagementService } from '../service/service.management.service';
import { Feature } from './model/feature.model';
import { Service } from './model/service.model';

@Component({
  selector: 'app-service-management',
  standalone: true,
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    FormsModule,
    SlicePipe,
    DatePipe,
  ],
  templateUrl: './service-management.component.html',
})
export class ServiceManagementComponent implements OnInit {
  // Signaux pour stocker les services et les caractéristiques
  services = signal<Service[]>([]);
  allFeatures = signal<Feature[]>([]);
  selectedFile = signal<File | null>(null);
  newServiceData: Partial<Service & { type?: string }> = {}; // Données pour création/mise à jour de service
  imageBaseUrl = `${environment.apiUrl}`;

  constructor(
    private router: Router,
    private serviceManagement: ServiceManagementService
  ) {}

  ngOnInit() {
    this.loadServices();
    this.loadFeatures();
  }

  // Méthodes de chargement
  loadServices() {
    this.serviceManagement.getAllServices().subscribe({
      next: (services) => {
        this.services.set(
          services.map((service) => ({
            ...service,
            showFullDescription: false,
            images: `${this.imageBaseUrl}/${service.images}`,
          }))
        );
      },
      error: (error) =>
        console.error('Erreur lors de la récupération des services:', error),
    });
  }

  loadFeatures() {
    this.serviceManagement.getAllFeatures().subscribe({
      next: (features: Feature[]) => this.allFeatures.set(features),
      error: (error) =>
        console.error(
          'Erreur lors de la récupération des caractéristiques:',
          error
        ),
    });
  }

  // Gestion des fichiers
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile.set(input.files[0]);
      console.log('Fichier sélectionné :', input.files[0]);
    }
  }

  // Gestion des images
  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = () =>
        (this.newServiceData.images = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  // Création d'un nouveau service
  createService() {
    if (!this.newServiceData.name || !this.newServiceData.description) {
      console.error('Veuillez remplir tous les champs');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.newServiceData.name);
    formData.append('description', this.newServiceData.description);
    const file = this.selectedFile();
    if (file) formData.append('image', file, file.name);

    console.log('Données envoyées dans formData:', formData);

    this.serviceManagement.createService(formData).subscribe({
      next: () => {
        this.loadServices();
        this.resetForm();
      },
      error: (error) =>
        console.error('Erreur lors de la création du service:', error),
    });
  }

  // Mise à jour d'un service existant
  updateService() {
    const { id_service, name, description, type } = this.newServiceData;
    if (!id_service || !name || !description || !type) {
      console.error('Veuillez remplir tous les champs');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('type', type);
    const file = this.selectedFile();
    if (file) formData.append('image', file);

    this.serviceManagement.updateService(id_service, formData).subscribe({
      next: (updatedService) => {
        this.services.update((services) =>
          services.map((s) =>
            s.id_service === updatedService.id_service
              ? {
                  ...updatedService,
                  showFullDescription: s.showFullDescription,
                  images: `${this.imageBaseUrl}/${updatedService.images}`,
                }
              : s
          )
        );
        this.resetForm();
      },
      error: (error) =>
        console.error('Erreur lors de la mise à jour du service:', error),
    });
  }

  // Pré-remplissage du formulaire pour la mise à jour
  editService(id_service: number) {
    const service = this.services().find((s) => s.id_service === id_service);
    if (service) this.newServiceData = { ...service };
  }

  // Suppression d'un service
  deleteService(id_service?: number) {
    if (!id_service) {
      console.error('ID invalide pour la suppression :', id_service);
      return;
    }

    this.serviceManagement.deleteService(id_service).subscribe({
      next: () => {
        this.services.update((services) =>
          services.filter((service) => service.id_service !== id_service)
        );
      },
      error: (error) =>
        console.error('Erreur lors de la suppression du service:', error),
    });
  }

  // Réinitialisation du formulaire
  resetForm() {
    this.newServiceData = {};
    this.selectedFile.set(null);
  }

  // Gestion de la description
  toggleDescription(id_service: number) {
    this.services.update((services) =>
      services.map((service) =>
        service.id_service === id_service
          ? { ...service, showFullDescription: !service.showFullDescription }
          : service
      )
    );
  }

  // Gestion des caractéristiques
  isFeatureSelected(feature: Feature): boolean {
    return !!this.newServiceData.features?.some(
      (f) => f.id_feature === feature.id_feature
    );
  }

  onFeatureChange(feature: Feature, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.newServiceData.features = isChecked
      ? [...(this.newServiceData.features || []), feature]
      : this.newServiceData.features?.filter(
          (f) => f.id_feature !== feature.id_feature
        );
  }

  // Navigation
  goBack() {
    this.router.navigate(['/admin']);
  }

  cancel() {
    this.resetForm();
  }
}
