import { Component, OnInit, signal, Output, EventEmitter } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SlicePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Animal } from '../../../core/models/animal.model';
import { Router } from '@angular/router';
import { AnimalManagementService } from '../service/animal-management.service';
import { environment } from '../../../../environments/environment.development';
import { Habitat } from '../../../core/models/habitat.model';
import { HabitatService } from '../../habitats/service/habitat.service';

@Component({
  selector: 'app-animal-management',
  standalone: true,
  imports: [ButtonComponent, SlicePipe, ReactiveFormsModule, FormsModule],
  templateUrl: './animal-management.component.html',
})
export class AnimalManagementComponent implements OnInit {
  animalList = signal<Animal[]>([]);
  newAnimal = signal<Partial<Animal>>({});
  selectedFile = signal<File | null>(null);
  habitats = signal<Habitat[]>([]);

  // Chemin d'accès aux images (dérivé de l'environnement)
  imageBaseUrl = `${environment.apiUrl}/uploads`;

  @Output() animalCreated = new EventEmitter<Animal>();
  @Output() animalUpdated = new EventEmitter<Animal>();
  @Output() animalDeleted = new EventEmitter<number>();

  constructor(
    private router: Router,
    private animalManagement: AnimalManagementService,
    private habitatService: HabitatService
  ) {}

  ngOnInit() {
    this.loadAnimals();
    this.loadHabitats();
  }

  loadAnimals() {
    this.animalManagement.getAllAnimals().subscribe({
      next: (animals) => {
        this.animalList.set(
          animals.map((animal) => ({
            ...animal,
            showDescription: false,
            // Vérifie si animal.image n'est pas null ou undefined avant de le manipuler
            image: animal.image
              ? `${this.imageBaseUrl}/${animal.image.replace(
                  /^.*uploads\/img-animaux\//,
                  ''
                )}`
              : null,
          }))
        );
      },
      error: (error) =>
        console.error('Erreur lors de la récupération des animaux :', error),
    });
  }

  loadHabitats() {
    this.habitatService.getHabitats().subscribe({
      next: (habitats) => {
        console.log('Habitats reçus:', habitats); // Log pour voir les données reçues
        this.habitats.set(habitats);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des habitats :', err);
      },
    });
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = () =>
        this.newAnimal.update((animal) => ({
          ...animal,
          image: reader.result as string,
        }));
      reader.readAsDataURL(file);
    }
  }

  validateAnimalData(animal: Partial<Animal>): boolean {
    return (
      typeof animal.name === 'string' &&
      animal.name.trim() !== '' &&
      typeof animal.species === 'string' &&
      animal.species.trim() !== '' &&
      typeof animal.habitatId === 'number'
    );
  }

  createAnimal() {
    const animalData = {
      ...this.newAnimal(),
      habitatId: Number(this.newAnimal().habitatId),
    };
    console.log("Données de l'animal avant validation :", animalData);

    if (this.validateAnimalData(animalData)) {
      const formData = this.buildFormData(animalData);
      this.animalManagement.createAnimal(formData).subscribe({
        next: (animal) => {
          this.animalCreated.emit(animal);
          this.loadAnimals();
          this.resetForm();
        },
        error: (err) =>
          console.error("Erreur lors de la création de l'animal :", err),
      });
    } else {
      console.error('Veuillez remplir tous les champs obligatoires.');
    }
  }

  updateAnimal() {
    const animalData = {
      ...this.newAnimal(),
      habitatId: Number(this.newAnimal().habitatId),
    };

    if (this.validateAnimalData(animalData)) {
      const formData = this.buildFormData(animalData);
      this.animalManagement
        .updateAnimal(this.newAnimal().id?.toString() || '', formData)
        .subscribe({
          next: (animal) => {
            this.animalUpdated.emit(animal);
            this.loadAnimals();
            this.resetForm();
          },
          error: (err) =>
            console.error("Erreur lors de la mise à jour de l'animal :", err),
        });
    } else {
      console.error('Veuillez remplir tous les champs obligatoires.');
    }
  }

  editAnimal(animalId: number) {
    const animal = this.animalList().find((a) => a.id === animalId);
    if (animal) {
      this.newAnimal.set({ ...animal });
    }
  }

  deleteAnimal(animalId: number) {
    this.animalManagement.deleteAnimal(animalId.toString()).subscribe({
      next: () => {
        console.log('Animal supprimé avec succès');
        this.animalDeleted.emit(animalId); // Optionnel, si écouté par un composant parent
        this.animalList.update((list) => list.filter((a) => a.id !== animalId));
        this.loadAnimals();
      },
      error: (err) =>
        console.error("Erreur lors de la suppression de l'animal :", err),
    });
  }

  resetForm() {
    this.newAnimal.set({});
    this.selectedFile.set(null);
  }

  cancel() {
    this.resetForm();
  }

  private buildFormData(animal: Partial<Animal>): FormData {
    const formData = new FormData();

    // Indiquer le dossier cible pour multer
    formData.append('folder', 'img-animaux'); // Définit le dossier cible pour l'animal

    if (this.selectedFile()) formData.append('image', this.selectedFile()!);

    Object.entries(animal).forEach(([key, value]) => {
      if (key !== 'id' && value != null) {
        formData.append(key, String(value));
      }
    });

    formData.forEach((value, key) => {
      console.log(`FormData key: ${key}, value: ${value}`);
    });

    return formData;
  }
}
