import { SlicePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { ModalComponent } from 'app/shared/components/modal/modal.component';
import { environment } from 'environments/environment.development';
import { Feature } from './model/feature.model';
import { Service } from './model/service.model';
import { ServiceManagementService } from './service/service.management.service';

@Component({
  selector: 'app-service-management',
  standalone: true,
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    FormsModule,
    SlicePipe,
    ModalComponent,
  ],
  templateUrl: './service-management.component.html',
})
export class ServiceManagementComponent implements OnInit {
  // Signaux pour stocker les services et les caractéristiques
  services = signal<Service[]>([]);
  allFeatures = signal<Feature[]>([]);
  selectedFile = signal<File | null>(null);
  newServiceData: Partial<Service & { type?: string }> = {}; // Données pour création/mise à jour de service
  imageBaseUrl = `${environment.apiUrl}/api`;
  showModal = false;
  isFeatureDropdownOpen = false;

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
        (this.newServiceData.images = reader.result as string); // Remplace l'image affichée par l'aperçu du fichier sélectionné
      reader.readAsDataURL(file);
      console.log('Fichier sélectionné pour la mise à jour :', file);
    }
  }

  // Création d'un nouveau service
  createService() {
    const { name, description, features } = this.newServiceData;
    if (!name || !description || !features) {
      console.error('Veuillez remplir tous les champs');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);

    // Convertir le tableau d'objets `features` en chaîne JSON
    formData.append('features', JSON.stringify(features));

    const file = this.selectedFile();
    if (file) {
      formData.append('image', file, file.name);
    } else {
      console.warn('Aucun fichier sélectionné pour l’image');
    }

    // Log pour vérifier le contenu de formData
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    this.serviceManagement.createService(formData).subscribe({
      next: () => {
        this.loadServices();
        this.resetForm();
      },
      error: (error: HttpErrorResponse) =>
        console.error('Erreur lors de la création du service:', error),
    });
  }

  // Ajout de vérifications supplémentaires pour la mise à jour du service
  updateService() {
    console.log(
      'Contenu de newServiceData avant la mise à jour :',
      this.newServiceData
    );

    const { id_service, name, description, features } = this.newServiceData;

    // Validation des champs requis
    if (!id_service || !name || !description || !Array.isArray(features)) {
      console.error('Champs manquants ou incorrects');
      return;
    }

    // Création de FormData pour envoyer les données au backend
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);

    const featuresJson = JSON.stringify(
      features.map((feature) => ({
        name: feature.name || '',
        type: feature.type || '',
        value: feature.value || '',
      }))
    );
    formData.append('features', featuresJson);

    if (this.selectedFile()) {
      formData.append(
        'image',
        this.selectedFile() as File,
        (this.selectedFile() as File).name
      );
    }

    // Envoyer les données au backend
    this.serviceManagement.updateService(id_service, formData).subscribe({
      next: (updatedService) => {
        console.log('Service mis à jour avec succès:', updatedService);

        // Rafraîchir la liste des services
        this.loadServices();

        // Réinitialiser le formulaire et le fichier sélectionné
        this.resetForm();
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du service:', error);
      },
    });
  }

  // Pré-remplissage du formulaire pour la mise à jour
  editService(id_service: number) {
    const service = this.services().find((s) => s.id_service === id_service);
    if (service) {
      this.newServiceData = {
        ...service,
        features: service.features || [],
      };
      this.showModal = true;
    }
  }

  // Ajouter une méthode pour réinitialiser et ouvrir le modal pour un nouveau service
  openNewServiceModal() {
    this.resetForm();
    this.showModal = true;
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
    this.isFeatureDropdownOpen = false;
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

  toggleModal() {
    this.showModal = !this.showModal;
    if (!this.showModal) {
      this.resetForm();
    }
  }

  toggleFeatureDropdown() {
    this.isFeatureDropdownOpen = !this.isFeatureDropdownOpen;
  }
}
