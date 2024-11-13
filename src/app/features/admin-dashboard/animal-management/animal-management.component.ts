import { SlicePipe } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment.development';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { HabitatService } from '../../habitats/service/habitat.service';
import { Habitat } from '../habitat-management/model/habitat.model';
import { CountResourceService } from '../stats-board/counts-resource/services/count-resource.service';
import { Animal } from './model/animal.model';
import { AnimalManagementService } from './service/animal-management.service';

@Component({
  selector: 'app-animal-management',
  standalone: true,
  imports: [ButtonComponent, SlicePipe, ReactiveFormsModule, FormsModule],
  templateUrl: './animal-management.component.html',
})
export class AnimalManagementComponent implements OnInit {
  /** Signaux pour stocker les listes d'animaux et d'habitats **/
  animals = signal<Animal[]>([]);
  habitats = signal<Habitat[]>([]);
  selectedHabitat = signal<number | null>(null);

  /** Fichier sélectionné pour l'image de l'animal **/
  selectedFile = signal<File | null>(null);

  /** Groupes d'animaux par habitat pour l'affichage **/
  groupedAnimals = signal<Record<number, Animal[]>>({});
  visibleAnimals = signal<Record<number, boolean>>({});

  /** Données temporaires pour le formulaire d'ajout ou de modification d'un animal **/
  newAnimalData = signal<Partial<Animal>>({});
  imageBaseUrl = `${environment.apiUrl}`; // URL des images

  filteredAnimals = computed(() =>
    this.animals().filter(
      (animal) => animal.habitat_id === this.selectedHabitat()
    )
  );

  constructor(
    private animalManagement: AnimalManagementService,
    private habitatService: HabitatService,
    private countResourceService: CountResourceService
  ) {}

  ngOnInit() {
    this.loadHabitats();
    this.loadAnimals();
  }

  /** Charge tous les habitats **/
  loadHabitats() {
    this.habitatService.getHabitats().subscribe({
      next: (habitats) => this.habitats.set(habitats),
      error: (err) => console.error('Erreur de chargement des habitats :', err),
    });
  }

  /** Charge tous les animaux **/
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
      error: (error) =>
        console.error('Erreur de chargement des animaux :', error),
    });
  }

  /** Gère le changement de fichier pour l'image **/
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
      console.log('Fichier sélectionné :', input.files[0]);
    }
  }

  /** Crée un nouvel animal si les champs sont valides **/
  createAnimal() {
    if (this.validateAnimalData()) {
      const formData = this.buildFormData();
      this.animalManagement.createAnimal(formData).subscribe({
        next: (response) => {
          console.log('Animal créé avec succès:', response);
          this.resetForm();
          this.loadAnimals();
          this.countResourceService.incrementTotalAnimals();
        },
        error: (error) =>
          console.error("Erreur de création de l'animal :", error),
      });
    } else {
      console.error('Champs requis manquants');
    }
  }

  /** Met à jour un animal existant **/
  updateAnimal() {
    if (this.validateAnimalData(true)) {
      const formData = this.buildFormData();
      this.animalManagement
        .updateAnimal(this.newAnimalData().id_animal!.toString(), formData)
        .subscribe({
          next: (updatedAnimal) => {
            console.log('Animal mis à jour avec succès :', updatedAnimal);
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
          },
          error: (error) =>
            console.error("Erreur de mise à jour de l'animal :", error),
        });
    } else {
      console.error('Champs requis manquants pour la mise à jour');
    }
  }

  /** Prépare le formulaire pour la modification de l'animal sélectionné **/
  editAnimal(animalId: number) {
    const animal = this.animals().find((a) => a.id_animal === animalId);
    if (animal) {
      this.newAnimalData.set({ ...animal });
      console.log("Formulaire pré-rempli pour l'animal :", animal);
    }
  }

  /** Supprime un animal et met à jour le compteur **/
  deleteAnimal(animalId: number) {
    this.animalManagement.deleteAnimal(animalId.toString()).subscribe({
      next: () => {
        this.animals.update((animals) =>
          animals.filter((a) => a.id_animal !== animalId)
        );
        this.countResourceService.decrementTotalAnimals();
        this.resetForm();
      },
      error: (error) =>
        console.error("Erreur de suppression de l'animal :", error),
    });
  }

  /** Réinitialise le formulaire et sélection de fichier **/
  resetForm() {
    this.newAnimalData.set({});
    this.selectedFile.set(null);
  }

  /** Cancel */
  cancel() {
    this.resetForm();
  }

  /** Affiche ou masque la description de l'animal **/
  toggleAnimal(animalId: number) {
    this.animals.update((animals) =>
      animals.map((a) =>
        a.id_animal === animalId ? { ...a, showTime: !a.showTime } : a
      )
    );
  }

  /** Affiche ou masque un groupe d'animaux pour un habitat donné **/
  toggleVisibility(habitatId: number) {
    this.visibleAnimals.update((visibility) => ({
      ...visibility,
      [habitatId]: !visibility[habitatId],
    }));
  }

  /** Valide les données de l'animal avant création/mise à jour **/
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

  /** Construit FormData pour la requête HTTP **/
  private buildFormData(): FormData {
    const formData = new FormData();
    Object.entries(this.newAnimalData()).forEach(([key, value]) => {
      formData.append(key, value?.toString() || '');
    });
    const file = this.selectedFile();
    if (file) formData.append('images', file);
    return formData;
  }

  /** Regroupe les animaux par habitat **/
  private groupAnimals() {
    const grouped = this.animals().reduce((acc, animal) => {
      (acc[animal.habitat_id] = acc[animal.habitat_id] || []).push(animal);
      return acc;
    }, {} as Record<number, Animal[]>);
    this.groupedAnimals.set(grouped);
  }
}
