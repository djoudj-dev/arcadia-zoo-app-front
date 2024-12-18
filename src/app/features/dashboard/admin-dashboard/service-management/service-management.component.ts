import { SlicePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FileSecurityService } from 'app/core/services/file-security.service';
import { ImageOptimizerService } from 'app/core/services/image-optimizer.service';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { ModalComponent } from 'app/shared/components/modal/modal.component';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { environment } from 'environments/environment.development';
import { firstValueFrom } from 'rxjs';
import { Feature } from './model/feature.model';
import { Service } from './model/service.model';
import { ServiceManagementService } from './service/service.management.service';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';

/**
 * Composant de gestion des services
 * Permet la création, modification et suppression des services
 * avec gestion des caractéristiques et des images
 */
@Component({
  selector: 'app-service-management',
  standalone: true,
  imports: [
    FormsModule,
    SlicePipe,
    ModalComponent,
    ButtonComponent,
    ToastComponent,
  ],
  templateUrl: './service-management.component.html',
})
export class ServiceManagementComponent implements OnInit {
  /** Signaux pour la gestion d'état réactive */
  services = signal<Service[]>([]);
  allFeatures = signal<Feature[]>([]);
  selectedFile = signal<File | null>(null);
  serviceToDelete: number | null = null;

  /** État du composant */
  newServiceData: Partial<Service & { type?: string }> = {};
  imageBaseUrl = `${environment.apiUrl}/api`;
  showModal = false;
  isFeatureDropdownOpen = false;

  constructor(
    readonly router: Router,
    readonly serviceManagement: ServiceManagementService,
    readonly toastService: ToastService,
    readonly fileSecurityService: FileSecurityService,
    readonly imageOptimizer: ImageOptimizerService
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

  /** Gère le changement de fichier sécurisé */
  async onFileSelected(file: File) {
    try {
      const validation = await this.fileSecurityService.validateFile(file);

      if (!validation.isValid) {
        this.toastService.showError(validation.errors.join('\n'));
        return;
      }

      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.newServiceData.images = reader.result as string;
        this.toastService.showSuccess('Image sélectionnée avec succès');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erreur lors du traitement du fichier:', error);
      this.toastService.showError('Erreur lors du traitement du fichier');
    }
  }

  /**
   * Gère le changement de fichier image
   * @param event L'événement de changement de fichier
   */
  async onFileChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Vérification du type de fichier
      if (!file.type.startsWith('image/')) {
        console.error('Le fichier doit être une image');
        return;
      }

      // Vérification de la taille du fichier (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB en octets
      if (file.size > maxSize) {
        console.error('Le fichier est trop volumineux (max 10MB)');
        return;
      }

      try {
        // Optimisation de l'image
        const optimizedImage = await this.imageOptimizer.optimizeImage(file);

        // Conversion en base64 pour l'aperçu
        const reader = new FileReader();
        reader.onload = () => {
          this.newServiceData.images = reader.result as string;
        };
        reader.readAsDataURL(optimizedImage);
      } catch (error) {
        console.error("Erreur lors du traitement de l'image:", error);
      }
    }
  }

  /** Crée un nouveau service */
  async createService() {
    try {
      const formData = this.buildFormData();
      await firstValueFrom(this.serviceManagement.createService(formData));

      this.toastService.showSuccess('Service créé avec succès !');

      this.toggleModal(); // Ferme le modal
      this.resetForm(); // Reset le formulaire
      this.loadServices(); // Recharge la liste des services
    } catch {
      this.toastService.showError('Erreur lors de la création du service');
    }
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

    this.serviceManagement.deleteService(id_service).subscribe({
      next: () => {
        this.services.update((services) =>
          services.filter((service) => service.id_service !== id_service)
        );
        this.toastService.showSuccess('Service supprimé avec succès');
      },
      error: (error) => {
        console.error('Erreur lors de la suppression du service:', error);
        this.toastService.showError('Erreur lors de la suppression du service');
      },
    });
  }

  /** Réinitialise le formulaire */
  resetForm() {
    this.newServiceData = {
      name: '',
      description: '',
      features: [],
      images: '',
    };
    this.selectedFile.set(null);
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
    const hasFile =
      this.selectedFile() || isUpdate || this.newServiceData.images;
    return !!(name && description && features && hasFile);
  }

  /** Construit le FormData pour l'envoi */
  private buildFormData(): FormData {
    const formData = new FormData();

    // Ajout des données de base
    formData.append('name', this.newServiceData.name ?? '');
    formData.append('description', this.newServiceData.description ?? '');

    // Conversion des features en JSON string
    if (this.newServiceData.features) {
      formData.append('features', JSON.stringify(this.newServiceData.features));
    }

    // Gestion de l'image
    const file = this.selectedFile();
    if (file) {
      formData.append('image', file, file.name);
    } else if (this.newServiceData.images) {
      // Si l'image vient d'une base64
      const base64Data = this.newServiceData.images.split(',')[1];
      const mimeType = this.newServiceData.images
        .split(',')[0]
        .split(':')[1]
        .split(';')[0];
      const blob = this.base64ToBlob(base64Data, mimeType);
      formData.append('image', blob, `image.${mimeType.split('/')[1]}`);
    }

    return formData;
  }

  private base64ToBlob(base64: string, type: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type });
  }

  confirmDeleteService(serviceId: number) {
    this.serviceToDelete = serviceId;
  }

  cancelDelete() {
    this.serviceToDelete = null;
  }

  deleteServiceConfirmed() {
    if (this.serviceToDelete !== null) {
      this.deleteService(this.serviceToDelete);
      this.serviceToDelete = null;
    }
  }
}
