import { SlicePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FileScanner } from 'app/core/services/file-security.service';
import { ImageOptimizerService } from 'app/core/services/image-optimizer.service';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { ToastComponent } from 'app/shared/components/toast/toast.component';
import { environment } from '../../../../../environments/environment';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CountResourceService } from '../stats-board/counts-resource/services/count-resource.service';
import { Habitat } from './model/habitat.model';
import { HabitatManagementService } from './service/habitat-management.service';

/**
 * Composant de gestion des habitats
 * Permet la création, modification et suppression des habitats
 * avec gestion des images et descriptions
 */
@Component({
  selector: 'app-habitat-management',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    SlicePipe,
    ToastComponent,
    ButtonComponent,
  ],
  templateUrl: './habitat-management.component.html',
})
export class HabitatManagementComponent implements OnInit {
  /** Signaux pour la gestion d'état réactive */
  habitats = signal<Habitat[]>([]);
  selectedFile = signal<File | null>(null);

  /** Données du formulaire d'habitat */
  newHabitatData: Partial<Habitat> = {};

  /** URL de base pour les images */
  imageBaseUrl = `${environment.apiUrl}/api`;

  constructor(
    readonly router: Router,
    readonly habitatManagement: HabitatManagementService,
    readonly countResourceService: CountResourceService,
    readonly toastService: ToastService,
    readonly fileSecurityService: FileScanner,
    readonly imageOptimizer: ImageOptimizerService
  ) {}

  ngOnInit() {
    this.loadHabitats();
  }

  /** Charge la liste des habitats */
  loadHabitats() {
    this.habitatManagement.getAllHabitats().subscribe({
      next: (habitats) => {
        const getImageUrl = (imagePath: string | null | undefined) => {
          if (!imagePath) return null;
          return imagePath.startsWith('http')
            ? imagePath
            : `${this.imageBaseUrl}/${imagePath.replace(/^\/+/, '')}`;
        };

        this.habitats.set(
          habitats.map((habitat) => ({
            ...habitat,
            showDescription: false,
            showDeleteConfirmation: false,
            images: getImageUrl(habitat.images),
          }))
        );
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des habitats:', error);
        this.toastService.showError('Erreur lors du chargement des habitats');
      },
    });
  }

  /** Gère le fichier sélectionné de manière sécurisée */
  async onFileSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      const validation = await this.fileSecurityService.scan(file);
      if (!validation.isSafe) {
        this.toastService.showError(validation.threats.join('\n'));
        return;
      }

      this.selectedFile.set(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.newHabitatData.images = reader.result as string;
      };
      reader.readAsDataURL(file);

      this.toastService.showSuccess('Image sélectionnée avec succès');
    } catch (error) {
      console.error('Erreur lors du traitement du fichier:', error);
      this.toastService.showError('Erreur lors du traitement du fichier');
    }
  }

  /** Crée un nouvel habitat */
  createHabitat() {
    if (this.validateHabitatData()) {
      const formData = this.buildFormData();

      this.habitatManagement.createHabitat(formData).subscribe({
        next: () => {
          this.resetForm();
          this.loadHabitats();
          this.countResourceService.incrementTotalHabitats();
          this.toastService.showSuccess('Habitat créé avec succès');
        },
        error: (error) => {
          console.error("Erreur lors de la création de l'habitat :", error);
          this.toastService.showError(
            "Erreur lors de la création de l'habitat"
          );
        },
      });
    } else {
      this.toastService.showError('Veuillez remplir tous les champs requis');
    }
  }

  /** Met à jour un habitat existant */
  updateHabitat() {
    if (this.validateHabitatData(true)) {
      const habitatId = this.newHabitatData.id_habitat!.toString();

      // Préparation des données de l'habitat
      const habitatData: Partial<Habitat> = {
        name: this.newHabitatData.name,
        description: this.newHabitatData.description,
        id_habitat: this.newHabitatData.id_habitat,
      };

      // Appel du service avec les données et l'image séparément
      this.habitatManagement
        .updateHabitat(habitatId, habitatData, this.selectedFile())
        .subscribe({
          next: (updatedHabitat) => {
            const imageUrl = this.formatImageUrl(updatedHabitat.images);
            this.habitats.update((habitats) =>
              habitats.map((h) =>
                h.id_habitat === updatedHabitat.id_habitat
                  ? {
                      ...updatedHabitat,
                      showDescription: h.showDescription,
                      images: imageUrl,
                    }
                  : h
              )
            );

            this.resetForm();
            this.toastService.showSuccess('Habitat mis à jour avec succès');
          },
          error: (error) => {
            console.error("Erreur lors de la mise à jour de l'habitat:", error);
            this.toastService.showError(
              "Erreur lors de la mise à jour de l'habitat"
            );
          },
        });
    } else {
      this.toastService.showError('Veuillez remplir tous les champs requis');
    }
  }

  private formatImageUrl(imagePath: string | null): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    // Suppression des doublons potentiels dans le chemin
    const cleanPath = imagePath.replace(
      /uploads\/habitats\/uploads\/habitats\//,
      'uploads/habitats/'
    );
    return `${this.imageBaseUrl}/${cleanPath}`;
  }

  /** Prépare le formulaire pour la modification */
  editHabitat(id_habitat: number) {
    const habitat = this.habitats().find((h) => h.id_habitat === id_habitat);
    if (habitat) {
      this.newHabitatData = { ...habitat };
      this.toastService.showSuccess('Habitat sélectionné pour modification');
    }
  }

  /** Prépare la confirmation de suppression */
  confirmDeleteHabitat(id_habitat: number) {
    this.habitats.update((habitats) =>
      habitats.map((habitat) =>
        habitat.id_habitat === id_habitat
          ? { ...habitat, showDeleteConfirmation: true }
          : habitat
      )
    );
  }

  /** Annule la confirmation de suppression */
  cancelDeleteHabitat(id_habitat: number) {
    this.habitats.update((habitats) =>
      habitats.map((habitat) =>
        habitat.id_habitat === id_habitat
          ? { ...habitat, showDeleteConfirmation: false }
          : habitat
      )
    );
  }

  /** Supprime un habitat */
  deleteHabitat(id_habitat: number | undefined) {
    if (!id_habitat) {
      this.toastService.showError("ID d'habitat invalide");
      return;
    }

    this.habitatManagement.deleteHabitat(id_habitat.toString()).subscribe({
      next: () => {
        this.habitats.update((habitats) =>
          habitats.filter((h) => h.id_habitat !== id_habitat)
        );
        this.countResourceService.decrementTotalHabitats();
        this.loadHabitats();
        this.resetForm();
        this.toastService.showSuccess('Habitat supprimé avec succès');
      },
      error: (error) => {
        console.error("Erreur lors de la suppression de l'habitat:", error);
        this.toastService.showError(
          "Erreur lors de la suppression de l'habitat"
        );
      },
    });
  }

  /** Réinitialise le formulaire */
  resetForm() {
    this.newHabitatData = {};
    this.selectedFile.set(null);
  }

  /** Annule l'édition en cours */
  cancel() {
    this.resetForm();
    this.toastService.showSuccess('Formulaire réinitialisé');
  }

  /** Gère l'affichage de la description */
  toggleDescription(id_habitat: number) {
    this.habitats.update((habitats) =>
      habitats.map((habitat) =>
        habitat.id_habitat === id_habitat
          ? { ...habitat, showDescription: !habitat.showDescription }
          : habitat
      )
    );
  }

  /** Navigation vers la page d'administration */
  goBack() {
    this.router.navigate(['/admin']);
  }

  /** Valide les données avant soumission */
  private validateHabitatData(isUpdate = false): boolean {
    const { name, description } = this.newHabitatData;
    const hasImage =
      isUpdate || this.newHabitatData.images || this.selectedFile();

    return !!(name && description && hasImage);
  }

  /** Construit le FormData de manière sécurisée */
  private buildFormData(): FormData {
    const formData = new FormData();
    const habitatData = this.newHabitatData;

    // Ajoute les données de base de l'habitat
    Object.entries(habitatData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Ajoute le fichier s'il existe
    const file = this.selectedFile();
    if (file) {
      const secureName = this.imageOptimizer.sanitizeFileName(file.name);
      formData.append('images', file, secureName);
    }

    return formData;
  }
}
