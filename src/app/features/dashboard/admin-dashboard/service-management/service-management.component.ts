import { SlicePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { ToastComponent } from 'app/shared/components/toast/toast.component';
import { environment } from 'environments/environment.development';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { Feature } from './model/feature.model';
import { Service } from './model/service.model';
import { ServiceManagementService } from './service/service.management.service';

/**
 * Composant de gestion des services
 * Permet la création, modification et suppression des services
 * avec gestion des caractéristiques et des images
 */
@Component({
  selector: 'app-service-management',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    SlicePipe,
    ModalComponent,
    ToastComponent,
    ButtonComponent,
  ],
  templateUrl: './service-management.component.html',
})
export class ServiceManagementComponent implements OnInit {
  /** Signaux pour la gestion d'état réactive */
  services = signal<Service[]>([]);
  allFeatures = signal<Feature[]>([]);
  selectedFile = signal<File | null>(null);

  /** État du composant */
  newServiceData: Partial<Service & { type?: string }> = {};
  imageBaseUrl = `${environment.apiUrl}/api`;
  showModal = false;
  isFeatureDropdownOpen = false;

  constructor(
    private router: Router,
    private serviceManagement: ServiceManagementService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadServices();
    this.loadFeatures();
  }

  /** Charge la liste des services */
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
      error: (error) => {
        console.error('Erreur lors de la récupération des services:', error);
        this.toastService.showError('Erreur lors du chargement des services');
      },
    });
  }

  /** Charge la liste des caractéristiques */
  loadFeatures() {
    this.serviceManagement.getAllFeatures().subscribe({
      next: (features: Feature[]) => {
        this.allFeatures.set(features);
      },
      error: (error) => {
        console.error(
          'Erreur lors de la récupération des caractéristiques:',
          error
        );
        this.toastService.showError(
          'Erreur lors du chargement des caractéristiques'
        );
      },
    });
  }

  /** Gère le changement de fichier pour l'image */
  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = () =>
        (this.newServiceData.images = reader.result as string);
      reader.readAsDataURL(file);
      this.toastService.showSuccess('Image sélectionnée avec succès');
    }
  }

  /** Crée un nouveau service */
  createService() {
    if (!this.validateServiceData()) {
      this.toastService.showError('Veuillez remplir tous les champs requis');
      return;
    }

    const formData = this.buildFormData();
    this.serviceManagement.createService(formData).subscribe({
      next: () => {
        this.loadServices();
        this.resetForm();
        this.toastService.showSuccess('Service créé avec succès');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors de la création du service:', error);
        this.toastService.showError('Erreur lors de la création du service');
      },
    });
  }

  /** Met à jour un service existant */
  updateService() {
    if (!this.validateServiceData(true)) {
      this.toastService.showError('Veuillez remplir tous les champs requis');
      return;
    }

    const formData = this.buildFormData();
    this.serviceManagement
      .updateService(this.newServiceData.id_service!, formData)
      .subscribe({
        next: () => {
          this.loadServices();
          this.resetForm();
          this.toastService.showSuccess('Service mis à jour avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du service:', error);
          this.toastService.showError(
            'Erreur lors de la mise à jour du service'
          );
        },
      });
  }

  /** Prépare le formulaire pour la modification */
  editService(id_service: number) {
    const service = this.services().find((s) => s.id_service === id_service);
    if (service) {
      this.newServiceData = { ...service, features: service.features || [] };
      this.showModal = true;
      this.toastService.showSuccess('Service sélectionné pour modification');
    }
  }

  /** Supprime un service */
  deleteService(id_service?: number) {
    if (!id_service) {
      this.toastService.showError('ID de service invalide');
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      this.serviceManagement.deleteService(id_service).subscribe({
        next: () => {
          this.services.update((services) =>
            services.filter((service) => service.id_service !== id_service)
          );
          this.toastService.showSuccess('Service supprimé avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du service:', error);
          this.toastService.showError(
            'Erreur lors de la suppression du service'
          );
        },
      });
    }
  }

  /** Réinitialise le formulaire */
  resetForm() {
    this.newServiceData = {};
    this.selectedFile.set(null);
    this.isFeatureDropdownOpen = false;
  }

  /** Gère l'affichage de la description */
  toggleDescription(id_service: number) {
    this.services.update((services) =>
      services.map((service) =>
        service.id_service === id_service
          ? { ...service, showFullDescription: !service.showFullDescription }
          : service
      )
    );
  }

  /** Vérifie si une caractéristique est sélectionnée */
  isFeatureSelected(feature: Feature): boolean {
    return !!this.newServiceData.features?.some(
      (f) => f.id_feature === feature.id_feature
    );
  }

  /** Gère le changement de sélection des caractéristiques */
  onFeatureChange(feature: Feature, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.newServiceData.features = isChecked
      ? [...(this.newServiceData.features || []), feature]
      : this.newServiceData.features?.filter(
          (f) => f.id_feature !== feature.id_feature
        );
  }

  /** Navigation */
  goBack() {
    this.router.navigate(['/admin']);
  }

  /** Gestion du modal */
  openNewServiceModal() {
    this.resetForm();
    this.showModal = true;
  }

  toggleModal() {
    this.showModal = !this.showModal;
    if (!this.showModal) {
      this.resetForm();
    }
  }

  toggleFeatureDropdown() {
    this.isFeatureDropdownOpen = !this.isFeatureDropdownOpen;
  }

  /** Valide les données avant soumission */
  private validateServiceData(isUpdate = false): boolean {
    const { name, description, features } = this.newServiceData;
    const hasFile = this.selectedFile() || isUpdate;
    return !!(name && description && features && (hasFile || isUpdate));
  }

  /** Construit le FormData pour l'envoi */
  private buildFormData(): FormData {
    const formData = new FormData();
    Object.entries(this.newServiceData).forEach(([key, value]) => {
      if (key === 'features') {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    const file = this.selectedFile();
    if (file) formData.append('image', file, file.name);
    return formData;
  }
}
