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
      this.animalManagement
        .updateAnimal(this.newAnimalData().id_animal!.toString(), formData)
        .subscribe({
          next: (updatedAnimal) => {
            this.animals.update((animals) =>
              animals.map((a) =>
                a.id_animal === updatedAnimal.id_animal
                  ? {
                      ...updatedAnimal,
                      showTime: a.showTime,
                      images: `${this.imageBaseUrl}/${updatedAnimal.images}`,
                    }
                  : a
              )
            );
            this.resetForm();
            this.toastService.showSuccess('Animal mis à jour avec succès');
          },
          error: (error) => {
            console.error("Erreur de mise à jour de l'animal :", error);
            this.toastService.showError(
              "Erreur lors de la mise à jour de l'animal"
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
    if (confirm('Êtes-vous sûr de vouloir supprimer cet animal ?')) {
      this.animalManagement.deleteAnimal(animalId.toString()).subscribe({
        next: () => {
          this.animals.update((animals) =>
            animals.filter((a) => a.id_animal !== animalId)
          );
          this.countResourceService.decrementTotalAnimals();
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
    this.animals.update((animals) =>
      animals.map((a) =>
        a.id_animal === animalId ? { ...a, showTime: !a.showTime } : a
      )
    );
  }

  /** Gère la visibilité des animaux par habitat */
  toggleVisibility(habitatId: number) {
    this.visibleAnimals.update((visibility) => ({
      ...visibility,
      [habitatId]: !visibility[habitatId],
    }));
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

    // Ajoute les données de base de l'animal de manière sécurisée
    Object.entries(animalData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Ajoute le fichier s'il existe avec un nom sécurisé
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
      (acc[animal.habitat_id] = acc[animal.habitat_id] || []).push(animal);
      return acc;
    }, {} as Record<number, Animal[]>);
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
