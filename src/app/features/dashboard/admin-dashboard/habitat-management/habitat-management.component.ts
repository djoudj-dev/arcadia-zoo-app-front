import { SlicePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { ToastComponent } from 'app/shared/components/toast/toast.component';
import { environment } from '../../../../../environments/environment.development';
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
    private router: Router,
    private habitatManagement: HabitatManagementService,
    private countResourceService: CountResourceService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadHabitats();
  }

  /** Charge la liste des habitats */
  loadHabitats() {
    this.habitatManagement.getAllHabitats().subscribe({
      next: (habitats) => {
        this.habitats.set(
          habitats.map((habitat) => ({
            ...habitat,
            showDescription: false,
            images: `${this.imageBaseUrl}/${habitat.images}`,
          }))
        );
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des habitats:', error);
        this.toastService.showError('Erreur lors du chargement des habitats');
      },
    });
  }

  /** Gère le changement de fichier pour l'image */
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
      this.toastService.showSuccess('Image sélectionnée avec succès');
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
      const formData = this.buildFormData();

      this.habitatManagement
        .updateHabitat(this.newHabitatData.id_habitat!.toString(), formData)
        .subscribe({
          next: (updatedHabitat) => {
            this.habitats.update((habitats) =>
              habitats.map((h) =>
                h.id_habitat === updatedHabitat.id_habitat
                  ? {
                      ...updatedHabitat,
                      showDescription: h.showDescription,
                      images: `${this.imageBaseUrl}/${updatedHabitat.images}`,
                    }
                  : h
              )
            );
            this.resetForm();
            this.toastService.showSuccess('Habitat mis à jour avec succès');
          },
          error: (error) => {
            console.error(
              "Erreur lors de la mise à jour de l'habitat :",
              error
            );
            this.toastService.showError(
              "Erreur lors de la mise à jour de l'habitat"
            );
          },
        });
    } else {
      this.toastService.showError('Veuillez remplir tous les champs requis');
    }
  }

  /** Prépare le formulaire pour la modification */
  editHabitat(id_habitat: number) {
    const habitat = this.habitats().find((h) => h.id_habitat === id_habitat);
    if (habitat) {
      this.newHabitatData = { ...habitat };
      this.toastService.showSuccess('Habitat sélectionné pour modification');
    }
  }

  /** Supprime un habitat */
  deleteHabitat(id_habitat: number | undefined) {
    if (!id_habitat) {
      this.toastService.showError("ID d'habitat invalide");
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer cet habitat ?')) {
      this.habitatManagement.deleteHabitat(id_habitat.toString()).subscribe({
        next: () => {
          this.habitats.update((habitats) =>
            habitats.filter((habitat) => habitat.id_habitat !== id_habitat)
          );
          this.countResourceService.decrementTotalHabitats();
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
    const hasFile = this.selectedFile() || isUpdate;
    return !!(name && description && hasFile);
  }

  /** Construit le FormData pour l'envoi */
  private buildFormData(): FormData {
    const formData = new FormData();
    Object.entries(this.newHabitatData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    const file = this.selectedFile();
    if (file) formData.append('images', file);
    return formData;
  }
}
