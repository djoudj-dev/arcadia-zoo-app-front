import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FileScanner } from 'app/core/services/file-security.service';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { environment } from '../../../../../environments/environment';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { HabitatService } from '../../../habitats/service/habitat.service';
import { Habitat } from '../habitat-management/model/habitat.model';
import { CountResourceService } from '../stats-board/counts-resource/services/count-resource.service';
import { Animal } from './model/animal.model';
import { AnimalManagementService } from './service/animal-management.service';
/**
 * Composant de gestion des animaux
 * Permet la création, modification et suppression des animaux
 * avec gestion des images et association aux habitats
 */
@Component({
  selector: 'app-animal-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonComponent,
  ],
  templateUrl: './animal-management.component.html',
})
export class AnimalManagementComponent implements OnInit {
  /** Signaux pour la gestion d'état réactive */
  animals = signal<Animal[]>([]);
  habitats = signal<Habitat[]>([]);
  selectedHabitat = signal<number | null>(null);
  selectedFile = signal<File | null>(null);
  groupedAnimals = signal<Record<number, Animal[]>>({});
  visibleAnimals = signal<Record<number, boolean>>({});
  newAnimalData = signal<Partial<Animal>>({});
  animalToDelete: number | null = null;

  /** URL de base pour les images */
  imageBaseUrl = `${environment.apiUrl}/api/uploads/animals`;

  /** Animaux filtrés par habitat sélectionné */
  filteredAnimals = computed(() =>
    this.animals().filter(
      (animal) => animal.habitat_id === this.selectedHabitat()
    )
  );

  constructor(
    readonly animalManagement: AnimalManagementService,
    readonly habitatService: HabitatService,
    readonly countResourceService: CountResourceService,
    readonly toastService: ToastService,
    readonly fileSecurityService: FileScanner
  ) {}

  ngOnInit() {
    this.loadHabitats();
    this.loadAnimals();
  }

  /** Initialise la visibilité pour tous les habitats */
  private initializeVisibility() {
    const visibility: Record<number, boolean> = {};
    this.habitats().forEach(habitat => {
      visibility[habitat.id_habitat] = false;
    });
    this.visibleAnimals.set(visibility);
  }

  /** Charge la liste des habitats */
  loadHabitats() {
    this.habitatService.getHabitats().subscribe({
      next: (habitats) => {
        this.habitats.set(habitats);
        this.initializeVisibility();
      },
      error: (err) => {
        console.error('Erreur de chargement des habitats :', err);
        this.toastService.showError('Erreur lors du chargement des habitats');
      },
    });
  }

  /** Charge la liste des animaux */
  loadAnimals(): void {
    this.animalManagement.getAllAnimals().subscribe({
      next: (animals) => {
        this.animals.set(
          animals.map((animal) => ({
            ...animal,
            showTime: false,
            images: animal.images,
          }))
        );
        this.groupAnimals();
      },
      error: (error) => {
        console.error('Erreur de chargement des animaux :', error);
        this.toastService.showError('Erreur lors du chargement des animaux');
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

  /** Crée un nouvel animal */
  createAnimal() {
    if (this.validateAnimalData()) {
      const formData = this.buildFormData();
      this.animalManagement.createAnimal(formData).subscribe({
        next: () => {
          this.resetForm();
          this.loadAnimals();
          this.countResourceService.incrementTotalAnimals();
          this.toastService.showSuccess('Animal créé avec succès');
        },
        error: (error) => {
          console.error("Erreur de création de l'animal :", error);
          this.toastService.showError("Erreur lors de la création de l'animal");
        },
      });
    } else {
      this.toastService.showError('Veuillez remplir tous les champs requis');
    }
  }

  /** Met à jour un animal existant */
  updateAnimal() {
    if (this.validateAnimalData(true)) {
      const formData = this.buildFormData();
      const animalId = this.newAnimalData().id_animal!.toString();

      this.animalManagement.updateAnimal(animalId, formData).subscribe({
        next: (updatedAnimal) => {
          // Vérification des données reçues
          if (updatedAnimal.name !== formData.get('name')) {
            this.toastService.showWarning(
              'Les données reçues diffèrent des données envoyées'
            );
          }

          const formattedAnimal = {
            ...updatedAnimal,
            images: updatedAnimal.images ?? '',
          };

          this.animals.update((animals) =>
            animals.map((a) =>
              a.id_animal === formattedAnimal.id_animal ? formattedAnimal : a
            )
          );

          this.groupAnimals();
          this.resetForm();
          this.toastService.showSuccess('Animal mis à jour avec succès');
        },
        error: (error) => {
          console.error("Erreur lors de la mise à jour de l'animal:", error);
          this.toastService.showError(
            "Erreur lors de la mise à jour de l'animal"
          );
        },
      });
    } else {
      this.toastService.showError('Veuillez remplir tous les champs requis');
    }
  }

  /** Prépare le formulaire pour la modification
   * @param animalId Identifiant de l'animal à modifier
   */
  editAnimal(animalId: number) {
    const animal = this.animals().find((a) => a.id_animal === animalId);
    if (animal) {
      this.newAnimalData.set({ ...animal });
      this.toastService.showSuccess('Animal sélectionné pour modification');
    }
  }

  /** Supprime un animal
   * @param animalId Identifiant de l'animal à supprimer
   */
  deleteAnimal(animalId: number) {
    const animal = this.animals().find((a) => a.id_animal === animalId);
    if (!animal) return;

    const confirmMessage = `Êtes-vous sûr de vouloir supprimer l'animal "${animal.name}" ?`;
    if (confirm(confirmMessage)) {
      this.animalManagement.deleteAnimal(animalId.toString()).subscribe({
        next: () => {
          this.animals.update((animals) =>
            animals.filter((a) => a.id_animal !== animalId)
          );
          this.groupAnimals();
          this.countResourceService.decrementTotalAnimals();
          this.loadAnimals();
          this.resetForm();
          this.toastService.showSuccess('Animal supprimé avec succès');
        },
        error: (error) => {
          console.error("Erreur de suppression de l'animal :", error);
          this.toastService.showError(
            "Erreur lors de la suppression de l'animal"
          );
        },
      });
    } else {
      this.toastService.showSuccess('Suppression annulée');
    }
  }

  /** Réinitialise le formulaire */
  resetForm() {
    this.newAnimalData.set({});
    this.selectedFile.set(null);
  }

  /** Annule l'édition en cours */
  cancel() {
    this.resetForm();
    this.toastService.showSuccess('Formulaire réinitialisé');
  }

  /** Gère l'affichage de la description */
  toggleAnimal(animalId: number) {
    const currentAnimal = this.animals().find((a) => a.id_animal === animalId);

    if (!currentAnimal) {
      console.error('Animal non trouvé:', animalId);
      return;
    }

    const updatedAnimals = this.animals().map((animal) => {
      if (animal.id_animal === animalId) {
        return {
          ...animal,
          showTime: !animal.showTime,
        };
      }
      return animal;
    });

    this.animals.set(updatedAnimals);
    this.groupAnimals();
  }

  /** Gère la visibilité des animaux par habitat */
  toggleVisibility(habitatId: number) {
    this.visibleAnimals.update((visibility) => ({
      ...visibility,
      [habitatId]: !visibility[habitatId],
    }));
  }

  /** Vérifie si un animal doit être affiché */
  isAnimalVisible(animal: Animal): boolean {
    if (!animal || !animal.habitat_id) return false;
    return this.visibleAnimals()[animal.habitat_id] ?? false;
  }

  /** Vérifie si la description complète doit être affichée */
  shouldShowFullDescription(animal: Animal): boolean {
    if (!animal) return false;
    const isShown = Boolean(animal.showTime);
    console.log(`Vérification description pour ${animal.name || 'animal inconnu'}:`, isShown);
    return isShown;
  }

  /** Valide les données avant soumission */
  private validateAnimalData(isUpdate = false): boolean {
    const requiredFields = [
      this.newAnimalData().name,
      this.newAnimalData().species,
      this.newAnimalData().habitat_id,
      this.newAnimalData().characteristics,
      this.newAnimalData().weightRange,
      this.newAnimalData().diet,
    ];
    if (isUpdate) requiredFields.push(this.newAnimalData().id_animal);
    return requiredFields.every(
      (field) => field !== undefined && field !== null
    );
  }

  /** Construit le FormData de manière sécurisée */
  private buildFormData(): FormData {
    const formData = new FormData();
    const animalData = this.newAnimalData();

    Object.entries(animalData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(
          key,
          typeof value === 'object' ? JSON.stringify(value) : String(value)
        );
      }
    });

    const file = this.selectedFile();
    if (file) {
      formData.append('images', file);
    }
    return formData;
  }

  /** Groupe les animaux par habitat */
  private groupAnimals() {
    // Initialiser avec tous les habitats, même ceux sans animaux
    const grouped: Record<number, Animal[]> = {};

    // Initialiser un tableau vide pour chaque habitat
    this.habitats().forEach(habitat => {
      grouped[habitat.id_habitat] = [];
    });

    // Ajouter les animaux à leurs habitats respectifs
    this.animals().forEach(animal => {
      if (animal.habitat_id) {
        grouped[animal.habitat_id].push({ ...animal });
      }
    });

    this.groupedAnimals.set(grouped);
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
        this.newAnimalData.update((current) => ({
          ...current,
          images: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);

      this.toastService.showSuccess('Image sélectionnée avec succès');
    } catch (error) {
      console.error('Erreur lors du traitement du fichier:', error);
      this.toastService.showError('Erreur lors du traitement du fichier');
    }
  }

  confirmDeleteAnimal(animalId: number) {
    this.animalToDelete = animalId;
  }

  cancelDelete() {
    this.animalToDelete = null;
  }

  deleteAnimalConfirmed() {
    if (this.animalToDelete !== null) {
      this.deleteAnimal(this.animalToDelete);
      this.animalToDelete = null;
    }
  }
}
