import { Component, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SlicePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Animal } from '../../../core/models/animal.model';
import { AnimalManagementService } from '../service/animal-management.service';
import { environment } from '../../../../environments/environment.development';
import { Habitat } from '../../../core/models/habitat.model';
import { HabitatService } from '../../habitats/service/habitat.service';
import { StatsService } from '../stats/services/stats.service';

@Component({
  selector: 'app-animal-management',
  standalone: true,
  imports: [ButtonComponent, SlicePipe, ReactiveFormsModule, FormsModule],
  templateUrl: './animal-management.component.html',
})
export class AnimalManagementComponent implements OnInit {
  // Signaux pour stocker la liste des animaux
  animals = signal<Animal[]>([]);
  habitats = signal<Habitat[]>([]);
  selectedFile = signal<File | null>(null);
  groupedAnimals = signal<Record<number, Animal[]>>({});
  visibleAnimals = signal<Record<number, boolean>>({});

  // Objet intermédiaire pour le formulaire
  newAnimalData = signal<Partial<Animal>>({});

  // Chemin d'accès aux images (dérivé de l'environnement)
  imageBaseUrl = `${environment.apiUrl}`;

  constructor(
    private animalManagement: AnimalManagementService,
    private habitatService: HabitatService,
    private statsService: StatsService
  ) {}

  ngOnInit() {
    this.loadHabitats();
    this.loadAnimals();
  }

  loadHabitats() {
    this.habitatService.getHabitats().subscribe({
      next: (habitats) => {
        this.habitats.set(habitats);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des habitats :', err);
      },
    });
  }

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
        console.error('Erreur lors de la récupération des animaux :', error),
    });
  }

  // Gestion du changement de fichier
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
      console.log('Fichier sélectionné :', input.files[0]);
    }
  }

  createAnimal() {
    if (
      this.newAnimalData().name &&
      this.newAnimalData().species &&
      this.newAnimalData().habitat_id &&
      this.newAnimalData().characteristics &&
      this.newAnimalData().weightRange &&
      this.newAnimalData().diet
    ) {
      const formData = new FormData();
      formData.append('name', this.newAnimalData().name || '');
      formData.append('species', this.newAnimalData().species || '');
      formData.append(
        'habitat_id',
        this.newAnimalData().habitat_id?.toString() ?? ''
      );
      formData.append(
        'characteristics',
        this.newAnimalData().characteristics || ''
      );
      formData.append('weightRange', this.newAnimalData().weightRange || '');
      formData.append('diet', this.newAnimalData().diet || '');

      const file = this.selectedFile();
      if (file) {
        formData.append('images', file);
      } else {
        console.error('Aucune image sélectionnée.');
        return;
      }

      this.animalManagement.createAnimal(formData).subscribe({
        next: (response) => {
          console.log('Animal créé avec succès:', response);
          this.resetForm();
          this.loadAnimals();
          this.statsService.incrementTotalAnimals();
        },
        error: (error) => {
          console.error("Erreur lors de la création de l'animal :", error);
        },
      });
    } else {
      console.error('Veuillez remplir tous les champs');
    }
  }

  updateAnimal() {
    const {
      id_animal,
      name,
      species,
      habitat_id,
      characteristics,
      weightRange,
      diet,
    } = this.newAnimalData();

    if (
      id_animal &&
      name &&
      species &&
      habitat_id &&
      characteristics &&
      weightRange &&
      diet
    ) {
      const formData = new FormData();

      // Ajout des champs au formData avec vérification des valeurs
      formData.append('name', name || '');
      formData.append('species', species || '');
      formData.append('habitat_id', habitat_id.toString() || '');
      formData.append('characteristics', characteristics || '');
      formData.append('weightRange', weightRange || '');
      formData.append('diet', diet || '');

      const file = this.selectedFile();
      if (file) formData.append('images', file);

      // Vérifiez chaque entrée dans formData
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      }); // Ajoutez cette parenthèse fermante ici

      this.animalManagement
        .updateAnimal(id_animal.toString(), formData)
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
            console.error("Erreur lors de la mise à jour de l'animal :", error),
        });
    } else {
      console.error('Veuillez remplir tous les champs');
    }
  }

  editAnimal(animal_id: number) {
    const animal = this.animals().find((a) => a.id_animal === animal_id);
    if (animal) {
      this.newAnimalData.set({ ...animal });
      console.log(
        "Formulaire pré-rempli avec les données de l'animal :",
        animal
      );
    }
  }

  deleteAnimal(animal_id: number | undefined) {
    if (animal_id === undefined || animal_id === null) {
      console.error("ID de l'animal invalide :", animal_id);
      return;
    }

    this.animalManagement.deleteAnimal(animal_id.toString()).subscribe({
      next: () => {
        this.animals.update((animals) =>
          animals.filter((a) => a.id_animal !== animal_id)
        );
        this.statsService.decrementTotalAnimals();
        this.resetForm();
      },
      error: (error) =>
        console.error("Erreur lors de la suppression de l'animal :", error),
    });
  }

  resetForm() {
    this.newAnimalData.set({});
    this.selectedFile.set(null);
  }

  cancel() {
    this.resetForm();
  }

  toggleAnimal(animalId: number) {
    this.animals.update((animals) =>
      animals.map((animal) =>
        animal.id_animal === animalId
          ? { ...animal, showTime: !animal.showTime }
          : animal
      )
    );
  }

  groupAnimals() {
    const grouped = this.animals().reduce((acc, animal) => {
      (acc[animal.habitat_id] = acc[animal.habitat_id] || []).push(animal);
      return acc;
    }, {} as { [key: number]: Animal[] });
    this.groupedAnimals.set(grouped);
    this.initializeVisibility();
  }

  initializeVisibility() {
    const visibility: Record<number, boolean> = {};
    Object.keys(this.groupedAnimals()).forEach((habitatId) => {
      visibility[Number(habitatId)] = false;
    });
    this.visibleAnimals.set(visibility);
  }

  toggleVisibility(habitatId: number) {
    this.visibleAnimals.update((visibility) => ({
      ...visibility,
      [habitatId]: !visibility[habitatId],
    }));
  }
}
