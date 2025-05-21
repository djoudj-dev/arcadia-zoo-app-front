import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FileScanner } from 'app/core/services/file-security.service';
import { ImageOptimizerService } from 'app/core/services/image-optimizer.service';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { environment } from 'environments/environment';
import { firstValueFrom } from 'rxjs';
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
  imports: [FormsModule, ButtonComponent],
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
    readonly imageOptimizer: ImageOptimizerService,
    readonly fileSecurityService: FileScanner
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
      const validation = await this.fileSecurityService.scan(file);

      if (!validation.isSafe) {
        this.toastService.showError(validation.threats.join('\n'));
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

  /** Gère le changement de fichier image */
  async onFileChange(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      const validation = await this.fileSecurityService.scan(file);
      if (!validation.isSafe) {
        this.toastService.showError(validation.threats.join('\n'));
        return;
      }

      // Définir le selectedFile pour le FormData
      this.selectedFile.set(file);

      // Créer l'aperçu
      const reader = new FileReader();
      reader.onload = () => {
        this.newServiceData.images = reader.result as string;
      };
      reader.readAsDataURL(file);

      this.toastService.showSuccess('Image sélectionnée avec succès');
    } catch (error) {
      console.error('Erreur lors du traitement du fichier:', error);
      this.toastService.showError('Erreur lors du traitement du fichier');
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

    if (isChecked) {
      // Créer une copie de la feature avec la valeur actuelle (si elle existe)
      const featureWithValue = {
        ...feature,
        value: feature.value || '' // Assurer que value est défini
      };

      // Ajouter la feature à la liste
      this.newServiceData.features = [
        ...(this.newServiceData.features || []),
        featureWithValue
      ];
    } else {
      // Retirer la feature de la liste
      this.newServiceData.features = this.newServiceData.features?.filter(
        (f) => f.id_feature !== feature.id_feature
      );
    }
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

  /** Construit le FormData de manière sécurisée */
  private buildFormData(): FormData {
    const formData = new FormData();
    const serviceData = this.newServiceData;

    // Ajoute les données de base du service
    Object.entries(serviceData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'features') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Ajoute le fichier s'il existe
    const file = this.selectedFile();
    if (file) {
      const secureName = this.imageOptimizer.sanitizeFileName(file.name);
      formData.append('image', file, secureName);
    }

    return formData;
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

  /** Annule la modification en cours */
  cancelEdit() {
    this.resetForm();
    this.toastService.showSuccess('Modification annulée');
  }
}
