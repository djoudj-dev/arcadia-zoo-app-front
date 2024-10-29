import { Component, signal, inject } from '@angular/core';
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
export class ServiceManagementComponent {
  serviceList = signal<Service[]>([]);
  features = signal<Feature[]>([]);
  newService = signal<Partial<Service>>({ features: [] });
  selectedFile = signal<File | null>(null);

  // Chemin d'accès aux images (dérivé de l'environnement)
  imageBaseUrl = `${environment.apiUrl}/uploads`;

  private router = inject(Router);
  private serviceManagement = inject(ServiceManagementService);

  constructor() {
    this.loadServices();
    this.loadFeatures();
  }

  loadServices() {
    this.serviceManagement.getAllServices().subscribe((services) => {
      const updatedServices = services.map((service) => {
        // Supprime toutes occurrences initiales de 'uploads/' pour éviter les doublons
        const imagePath = service.image.replace(/^\/?uploads\/?/i, '');
        return {
          ...service,
          image: `${this.imageBaseUrl}/${imagePath}`,
        };
      });
      this.serviceList.set(updatedServices);
    });
  }

  loadFeatures() {
    this.serviceManagement.getAllFeatures().subscribe((features) => {
      this.features.set(features);
    });
  }

  isFeatureSelected = (feature: Feature): boolean =>
    !!this.newService().features?.some((f) => f.id === feature.id);

  onFeatureChange(feature: Feature, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const updatedFeatures = [...(this.newService().features || [])];

    if (isChecked) {
      if (!updatedFeatures.some((f) => f.id === feature.id)) {
        updatedFeatures.push(feature);
      }
    } else {
      const filteredFeatures = updatedFeatures.filter(
        (f) => f.id !== feature.id
      );
      this.newService.set({ ...this.newService(), features: filteredFeatures });
      return;
    }
    this.newService.set({ ...this.newService(), features: updatedFeatures });
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = () =>
        this.newService.set({
          ...this.newService(),
          image: reader.result as string,
        });
      reader.readAsDataURL(file);
    }
  }

  createService() {
    const { name, description, location, hours, features } = this.newService();
    if (name && description && location && hours && features?.length) {
      const formData = this.buildFormData(this.newService());
      this.serviceManagement.createService(formData).subscribe({
        next: (createdService) => {
          this.serviceList.set([...this.serviceList(), createdService]);
          this.newService.set({ features: [] });
          this.selectedFile.set(null);
        },
        error: (error) =>
          console.error('Erreur lors de la création du service:', error),
        complete: () => this.loadServices(),
      });
    }
  }

  updateService() {
    const { name, description, location, hours, features, id } =
      this.newService();
    if (name && description && location && hours && features && id) {
      const formData = this.buildFormData(this.newService());
      this.serviceManagement.updateService(id, formData).subscribe({
        next: () => {
          this.newService.set({ features: [] });
          this.selectedFile.set(null);
          this.loadServices();
        },
        error: (error) =>
          console.error('Erreur lors de la mise à jour du service:', error),
      });
    }
  }

  editService(serviceId: number) {
    const service = this.serviceList().find((s) => s.id === serviceId);
    if (service) {
      this.newService.set({ ...service });
    }
  }

  deleteService(serviceId: number) {
    this.serviceManagement.deleteService(serviceId).subscribe(() => {
      this.serviceList.set(
        this.serviceList().filter((service) => service.id !== serviceId)
      );
      this.loadServices();
    });
  }

  toggleDescription(serviceId: number) {
    const service = this.serviceList().find((s) => s.id === serviceId);
    if (service) {
      service.showFullDescription = !service.showFullDescription;
      this.serviceList.set([...this.serviceList()]);
    }
  }

  cancel() {
    this.newService.set({ features: [] });
    this.selectedFile.set(null);
  }

  goBack() {
    this.router.navigate(['/admin']);
  }

  private buildFormData(service: Partial<Service>): FormData {
    const formData = new FormData();

    // Spécifiez le dossier cible pour multer
    formData.append('folder', 'img-services');

    if (this.selectedFile()) formData.append('image', this.selectedFile()!);

    Object.entries(service).forEach(([key, value]) => {
      if (key !== 'id' && value != null) {
        formData.append(key, String(value));
      }
    });

    return formData;
  }
}
