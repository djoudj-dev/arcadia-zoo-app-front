import { SlicePipe } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileSecurityService } from 'app/core/services/file-security.service';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { ToastComponent } from 'app/shared/components/toast/toast.component';
import { FileUploadDirective } from 'app/shared/directives/file-upload.directive';
import { environment } from '../../../../../environments/environment.development';
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
    SlicePipe,
    ReactiveFormsModule,
    FormsModule,
    ToastComponent,
    ButtonComponent,
    FileUploadDirective,
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

  /** URL de base pour les images */
  imageBaseUrl = `${environment.apiUrl}/api`;

  /** Animaux filtrés par habitat sélectionné */
  filteredAnimals = computed(() =>
    this.animals().filter(
      (animal) => animal.habitat_id === this.selectedHabitat()
    )
  );

  constructor(
    private animalManagement: AnimalManagementService,
    private habitatService: HabitatService,
    private countResourceService: CountResourceService,
    private toastService: ToastService,
    private fileSecurityService: FileSecurityService
  ) {}

  ngOnInit() {
    this.loadHabitats();
    this.loadAnimals();
  }

  /** Charge la liste des habitats */
  loadHabitats() {
    this.habitatService.getHabitats().subscribe({
      next: (habitats) => this.habitats.set(habitats),
      error: (err) => {
        console.error('Erreur de chargement des habitats :', err);
        this.toastService.showError('Erreur lors du chargement des habitats');
      },
    });
  }

  /** Charge la liste des animaux */
  loadAnimals() {
    this.animalManagement.getAllAnimals().subscribe({
      next: (animals) => {
        this.animals.set(
          animals.map((animal) => ({
            ...animal,
            showTime: false,
            images: `${this.imageBaseUrl}/${animal.images}`,
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

      // Vérification des données avant envoi
      console.log('Données actuelles:', this.newAnimalData());

      this.animalManagement.updateAnimal(animalId, formData).subscribe({
        next: (updatedAnimal) => {
          console.log('Comparaison des données:');
          console.log('Données envoyées:', this.newAnimalData());
          console.log('Données reçues:', updatedAnimal);

          if (updatedAnimal.name !== this.newAnimalData().name) {
            console.warn(
              'Attention: Les données reçues ne correspondent pas aux données envoyées'
            );
          }

          // Mise à jour immédiate du cache local
          this.animals.update((animals) =>
            animals.map((a) =>
              a.id_animal === updatedAnimal.id_animal
                ? {
                    ...updatedAnimal,
                    showTime: a.showTime,
                    images: updatedAnimal.images
                      ? `${this.imageBaseUrl}/${updatedAnimal.images}`
                      : a.images,
                  }
                : a
            )
          );

          // Forcer le rechargement des données
          this.loadAnimals();

          this.resetForm();
          this.toastService.showSuccess('Animal mis à jour avec succès');
        },
        error: (error) => {
          console.error('Erreur complète:', error);
          this.toastService.showError(
            `Erreur lors de la mise à jour de l'animal: ${error.message}`
          );
        },
      });
    } else {
      this.toastService.showError('Veuillez remplir tous les champs requis');
    }
  }

  /** Prépare le formulaire pour la modification */
  editAnimal(animalId: number) {
    const animal = this.animals().find((a) => a.id_animal === animalId);
    if (animal) {
      this.newAnimalData.set({ ...animal });
      this.toastService.showSuccess('Animal sélectionné pour modification');
    }
  }

  /** Supprime un animal */
  deleteAnimal(animalId: number) {
    // Récupérer le nom de l'animal pour le message
    const animal = this.animals().find((a) => a.id_animal === animalId);
    if (!animal) return;

    // Afficher le toast de confirmation
    const confirmMessage = `Êtes-vous sûr de vouloir supprimer l'animal "${animal.name}" ?`;

    // Créer un toast de confirmation personnalisé
    const toast = document.createElement('div');
    toast.className =
      'fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 flex flex-col gap-4';
    toast.innerHTML = `
      <p class="text-gray-800">${confirmMessage}</p>
      <div class="flex justify-end gap-2">
        <button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" id="confirmDelete">
          Supprimer
        </button>
        <button class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400" id="cancelDelete">
          Annuler
        </button>
      </div>
    `;

    document.body.appendChild(toast);

    // Gérer les actions de confirmation/annulation
    const handleConfirm = () => {
      this.animalManagement.deleteAnimal(animalId.toString()).subscribe({
        next: () => {
          // Mettre à jour le state local
          this.animals.update((animals) =>
            animals.filter((a) => a.id_animal !== animalId)
          );

          // Mettre à jour les groupes
          this.groupAnimals();

          // Mettre à jour les compteurs
          this.countResourceService.decrementTotalAnimals();

          // Recharger la liste complète des animaux
          this.loadAnimals();

          // Réinitialiser le formulaire si nécessaire
          this.resetForm();

          // Nettoyer le toast et afficher le message de succès
          document.body.removeChild(toast);
          this.toastService.showSuccess('Animal supprimé avec succès');
        },
        error: (error) => {
          console.error("Erreur de suppression de l'animal :", error);
          document.body.removeChild(toast);
          this.toastService.showError(
            "Erreur lors de la suppression de l'animal"
          );
        },
        complete: () => {
          // S'assurer que l'interface est bien à jour
          this.groupAnimals();
        },
      });
    };

    const handleCancel = () => {
      document.body.removeChild(toast);
      this.toastService.showSuccess('Suppression annulée');
    };

    // Ajouter les écouteurs d'événements
    document
      .getElementById('confirmDelete')
      ?.addEventListener('click', handleConfirm);
    document
      .getElementById('cancelDelete')
      ?.addEventListener('click', handleCancel);

    // Ajouter une animation d'entrée
    requestAnimationFrame(() => {
      toast.style.transition = 'opacity 0.3s, transform 0.3s';
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
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
    // Récuprer l'état actuel de l'animal
    const currentAnimal = this.animals().find((a) => a.id_animal === animalId);

    if (!currentAnimal) {
      console.error('Animal non trouvé:', animalId);
      return;
    }

    // Créer une nouvelle copie du tableau avec l'état mis à jour
    const updatedAnimals = this.animals().map((animal) => {
      if (animal.id_animal === animalId) {
        return {
          ...animal,
          showTime: !animal.showTime,
        };
      }
      return animal;
    });

    // Mettre à jour le signal avec le nouveau tableau
    this.animals.set(updatedAnimals);

    // Forcer le regroupement des animaux pour mettre à jour l'affichage
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
    return this.visibleAnimals()[animal.habitat_id] ?? false;
  }

  /** Vérifie si la description complète doit être affichée */
  shouldShowFullDescription(animal: Animal): boolean {
    const isShown = Boolean(animal.showTime);
    console.log(`Vérification description pour ${animal.name}:`, isShown);
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

    // Conversion des données en objet simple
    const dataToSend = {
      name: animalData.name || '',
      species: animalData.species || '',
      habitat_id: animalData.habitat_id?.toString() || '',
      characteristics: animalData.characteristics || '',
      weightRange: animalData.weightRange || '',
      diet: animalData.diet || '',
      vetNote: animalData.veterinary
        ? JSON.stringify(animalData.veterinary)
        : '',
    };

    // Ajout des données au FormData de manière sûre
    Object.entries(dataToSend).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Si on est en mode mise à jour, ajouter l'ID
    if (animalData.id_animal) {
      formData.append('id_animal', animalData.id_animal.toString());
    }

    // Gestion de l'image
    const file = this.selectedFile();
    if (file) {
      const secureName = this.fileSecurityService.sanitizeFileName(file.name);
      formData.append('images', file, secureName);
    }

    return formData;
  }

  /** Groupe les animaux par habitat */
  private groupAnimals() {
    const grouped = this.animals().reduce((acc, animal) => {
      if (!acc[animal.habitat_id]) {
        acc[animal.habitat_id] = [];
      }
      acc[animal.habitat_id].push({ ...animal }); // Créer une nouvelle copie de l'animal
      return acc;
    }, {} as Record<number, Animal[]>);

    // Mettre à jour le signal avec les nouveaux groupes
    this.groupedAnimals.set(grouped);
  }

  /** Gère le fichier sélectionné de manière sécurisée */
  async onFileSelected(file: File) {
    try {
      const validation = await this.fileSecurityService.validateFile(file);

      if (!validation.isValid) {
        this.toastService.showError(validation.errors.join('\n'));
        return;
      }

      const secureName = this.fileSecurityService.sanitizeFileName(file.name);
      const secureFile = new File([file], secureName, { type: file.type });

      this.selectedFile.set(secureFile);
      this.toastService.showSuccess('Image sélectionnée avec succès');
    } catch (error) {
      console.error('Erreur lors du traitement du fichier:', error);
      this.toastService.showError('Erreur lors du traitement du fichier');
    }
  }
}
