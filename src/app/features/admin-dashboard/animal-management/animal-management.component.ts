import { Component, OnInit } from '@angular/core';
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
  styleUrl: './animal-management.component.css',
})
export class AnimalManagementComponent implements OnInit {
  animalList: Animal[] = [];
  newAnimal: Partial<Animal> = {}; // Utilisation de Partial pour indiquer que toutes les propriétés ne sont pas nécessaires
  selectedFile: File | null = null;
  habitats: Habitat[] = [];

  constructor(
    private router: Router,
    private animalManagement: AnimalManagementService,
    private habitatService: HabitatService
  ) {}

  ngOnInit() {
    this.loadAnimals();
    this.loadHabitats();
  }

  // Charger la liste des animaux
  loadAnimals() {
    this.animalManagement.getAllAnimals().subscribe((animals: Animal[]) => {
      this.animalList = animals.map((animal) => ({
        ...animal,
        image: `${environment.apiUrl}/uploads/${animal.image}`,
      }));
    });
  }

  // Charger la liste des habitats
  loadHabitats() {
    this.habitatService.getHabitats().subscribe((habitats: Habitat[]) => {
      this.habitats = habitats.map((habitat) => ({
        ...habitat,
        id: Number(habitat.id), // Convertir l'ID en number
      }));
    });
  }

  // Gérer le changement de fichier
  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file; // Met à jour la variable selectedFile
      const reader = new FileReader();
      reader.onload = () => {
        this.newAnimal.image = reader.result as string; // Prévisualisation de l'image (facultatif)
      };
      reader.readAsDataURL(file);
    } else {
      console.error('Aucun fichier sélectionné.');
    }
  }

  // Créer un nouvel animal
  createAnimal() {
    console.log('Données du nouvel animal :', this.newAnimal);

    if (
      this.newAnimal.habitatId != null &&
      Object.values(this.newAnimal).every((value) => value != null)
    ) {
      const formData = new FormData();

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      // Vérifiez que characteristics est bien un tableau
      if (typeof this.newAnimal.characteristics === 'string') {
        this.newAnimal.characteristics = this.newAnimal.characteristics
          .split(',')
          .map((char) => char.trim());
      }

      if (Array.isArray(this.newAnimal.characteristics)) {
        this.newAnimal.characteristics.forEach((characteristic) => {
          formData.append('characteristics', characteristic);
        });
      }

      Object.entries(this.newAnimal).forEach(([key, value]) => {
        if (key !== 'characteristics') {
          formData.append(key, value as string);
        }
      });

      this.animalManagement.createAnimal(formData).subscribe(
        (animal) => {
          console.log('Animal créé avec succès :', animal);
          this.loadAnimals();
        },
        (error) => {
          console.error("Erreur lors de la création de l'animal :", error);
        }
      );
    } else {
      console.error('Veuillez remplir tous les champs obligatoires.');
    }
  }

  // Mettre à jour un animal existant
  updateAnimal() {
    console.log("Données de l'animal à mettre à jour :", this.newAnimal);

    // Vérification des champs obligatoires
    if (
      this.newAnimal.habitatId != null && // Vérifiez que habitatId est défini
      Object.values(this.newAnimal).every((value) => value != null) // Assurez-vous que toutes les valeurs ne sont pas nulles
    ) {
      const formData = new FormData();
      if (this.selectedFile) {
        formData.append('image', this.selectedFile); // Ajouter l'image si elle est sélectionnée
      }

      // Ajoutez les caractéristiques
      if (Array.isArray(this.newAnimal.characteristics)) {
        this.newAnimal.characteristics.forEach((characteristic) => {
          formData.append('characteristics', characteristic);
        });
      }

      // Ajoutez l'ID de l'habitat
      formData.append('habitatId', this.newAnimal.habitatId.toString());

      Object.entries(this.newAnimal).forEach(([key, value]) => {
        if (key !== 'habitatId' && key !== 'characteristics') {
          // Évitez de réajouter habitatId et characteristics
          formData.append(key, value as string);
        }
      });

      this.animalManagement
        .updateAnimal(this.newAnimal.id?.toString() || '', formData)
        .subscribe(
          (animal) => {
            console.log('Animal mis à jour avec succès :', animal);
            this.loadAnimals();
          },
          (error) => {
            console.error("Erreur lors de la mise à jour de l'animal :", error);
          }
        );
    } else {
      console.error('Veuillez remplir tous les champs obligatoires.');
    }
  }

  // Remplir le formulaire avec les données de l'animal sélectionné
  editAnimal(animalId: number) {
    const animal = this.animalList.find((a) => a.id === animalId);
    if (animal) {
      this.newAnimal = { ...animal }; // Copie de l'animal sélectionné
      this.newAnimal.habitatId = animal.habitatId; // Assurez-vous de copier l'ID de l'habitat
      this.newAnimal.habitat = animal.habitatId.toString(); // Convertir l'ID en string si nécessaire
    }
  }

  // Supprimer un animal existant
  deleteAnimal(animalId: number) {
    this.animalManagement.deleteAnimal(animalId.toString()).subscribe(
      () => {
        console.log('Animal supprimé');
        this.animalList = this.animalList.filter(
          (animal) => animal.id !== animalId
        );
        this.loadAnimals(); // Recharger la liste des animaux
      },
      (error) => {
        console.error("Erreur lors de la suppression de l'animal:", error);
      }
    );
  }

  // Annuler l'édition ou la création de l'animal
  cancel() {
    this.newAnimal = {}; // Réinitialiser le formulaire
    this.selectedFile = null; // Réinitialiser l'image sélectionnée
  }
}
