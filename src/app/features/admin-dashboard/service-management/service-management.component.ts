import { Component, signal, inject, Output, EventEmitter } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SlicePipe } from '@angular/common';
import { Service } from '../../../core/models/service.model';
import { ServiceManagementService } from '../service/service.management.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Feature } from '../../../core/models/feature.model';
import { environment } from '../../../../environments/environment.development';
import { Router } from '@angular/router';
import { StatsService } from '../stats/services/stats.service';

@Component({
  selector: 'app-service-management',
  standalone: true,
  imports: [ButtonComponent, SlicePipe, ReactiveFormsModule, FormsModule],
  templateUrl: './service-management.component.html',
})
export class ServiceManagementComponent {
  serviceList = signal<Service[]>([]);
  features = signal<Feature[]>([]);
  newService = signal<Partial<Service>>({ features: [] });
  selectedFile = signal<File | null>(null);
  visibleServices = signal<Record<number, boolean>>({});

  // Chemin d'accès aux images (dérivé de l'environnement)
  imageBaseUrl = `${environment.apiUrl}/uploads`;

  @Output() serviceCreated = new EventEmitter<Service>();
  @Output() serviceUpdated = new EventEmitter<Service>();
  @Output() serviceDeleted = new EventEmitter<number>();

  private router = inject(Router);
  private serviceManagement = inject(ServiceManagementService);
  private statsService = inject(StatsService);

  constructor() {
    this.loadServices();
    this.loadFeatures();
  }

  loadServices() {
    this.serviceManagement.getAllServices().subscribe({
      next: (services) => {
        const updatedServices = services.map((service) => ({
          ...service,
          image: `${this.imageBaseUrl}/${service.image.replace(
            /^\/?uploads\/?/i,
            ''
          )}`,
          showFullDescription: false, // Initialise showFullDescription pour chaque service
        }));
        this.serviceList.set(updatedServices);
        this.initializeVisibility(); // Initialise la visibilité après le chargement
      },
      error: () => alert('Erreur lors du chargement des services.'),
    });
  }

  initializeVisibility() {
    const visibility: Record<number, boolean> = {};
    this.serviceList().forEach((service) => {
      visibility[service.id] = false;
    });
    this.visibleServices.set(visibility);
  }

  toggleVisibility(serviceId: number) {
    this.visibleServices.update((visibility) => ({
      ...visibility,
      [serviceId]: !visibility[serviceId],
    }));
  }

  toggleDescription(serviceId: number) {
    const service = this.serviceList().find((s) => s.id === serviceId);
    if (service) {
      service.showFullDescription = !service.showFullDescription;
      this.serviceList.set([...this.serviceList()]);
    }
  }

  loadFeatures() {
    this.serviceManagement.getAllFeatures().subscribe({
      next: (features) => {
        console.log('Caractéristiques chargées :', features); // Pour le débogage
        this.features.set(features);
      },
      error: () => alert('Erreur lors du chargement des caractéristiques.'),
    });
  }

  isFeatureSelected(feature: Feature): boolean {
    return !!this.newService().features?.some((f) => f.id === feature.id);
  }

  onFeatureChange(feature: Feature, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const updatedFeatures = [...(this.newService().features || [])];

    if (isChecked && !updatedFeatures.some((f) => f.id === feature.id)) {
      updatedFeatures.push(feature);
    } else {
      this.newService.set({
        ...this.newService(),
        features: updatedFeatures.filter((f) => f.id !== feature.id),
      });
      return;
    }
    this.newService.set({ ...this.newService(), features: updatedFeatures });
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = () =>
        this.newService.set({
          ...this.newService(),
          image: reader.result as string,
        });
      reader.readAsDataURL(file);
    } else {
      alert('Veuillez sélectionner un fichier image valide.');
    }
  }

  validateServiceData(service: Partial<Service>): boolean {
    return (
      typeof service.name === 'string' &&
      service.name.trim() !== '' &&
      typeof service.description === 'string' &&
      service.description.trim() !== '' &&
      typeof service.location === 'string' &&
      service.location.trim() !== '' &&
      typeof service.hours === 'string' &&
      service.hours.trim() !== ''
    );
  }

  createService() {
    const serviceData = { ...this.newService() };
    if (this.validateServiceData(serviceData)) {
      const formData = this.buildFormData(serviceData);
      console.log('Données envoyées :', serviceData); // Log pour déboguer les données
      this.serviceManagement.createService(formData).subscribe({
        next: (service) => {
          this.serviceCreated.emit(service);
          this.loadServices();
          this.resetNewService();
          this.statsService.incrementTotalServices();
        },
        error: (err) =>
          console.error('Erreur lors de la création du service :', err),
      });
    } else {
      console.error('Veuillez remplir tous les champs obligatoires.');
    }
  }

  updateService() {
    const serviceData = { ...this.newService() };
    if (this.validateServiceData(serviceData) && serviceData.id) {
      const formData = this.buildFormData(serviceData);
      this.serviceManagement.updateService(serviceData.id, formData).subscribe({
        next: (service) => {
          this.serviceUpdated.emit(service);
          this.loadServices();
          this.resetNewService();
        },
        error: (err) =>
          console.error('Erreur lors de la mise à jour du service :', err),
      });
    } else {
      console.error('Veuillez remplir tous les champs obligatoires.');
    }
  }

  editService(serviceId: number) {
    const service = this.serviceList().find((s) => s.id === serviceId);
    if (service) {
      this.newService.set({ ...service });
    }
  }

  deleteService(serviceId: number) {
    this.serviceManagement.deleteService(serviceId).subscribe({
      next: () => {
        this.serviceDeleted.emit(serviceId);
        this.statsService.decrementTotalServices();
        this.serviceList.update((list) =>
          list.filter((service) => service.id !== serviceId)
        );
        this.loadServices();
      },
      error: (err) =>
        console.error('Erreur lors de la suppression du service :', err),
    });
  }

  resetNewService() {
    this.newService.set({ features: [] });
    this.selectedFile.set(null);
  }

  cancel() {
    this.resetNewService();
  }

  goBack() {
    this.router.navigate(['/admin']);
  }

  private buildFormData(service: Partial<Service>): FormData {
    const formData = new FormData();
    formData.append('folder', 'img-services');

    if (this.selectedFile()) {
      formData.append('image', this.selectedFile()!);
    }

    formData.append(
      'features',
      JSON.stringify(service.features?.map((feature) => feature.id) || [])
    );

    (['name', 'description', 'location', 'hours'] as (keyof Service)[]).forEach(
      (key) => {
        if (service[key]) formData.append(key, String(service[key]));
      }
    );

    return formData;
  }
}
