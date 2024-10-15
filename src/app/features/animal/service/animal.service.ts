import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ANIMALS } from '../../../core/mocks/animals-mock.component';
import { Animal } from '../../../core/models/animal.model';

@Injectable({
  providedIn: 'root',
})
export class AnimalService {
  constructor() {}

  // Récupérer la liste de tous les animaux (mock pour l'instant)
  getAnimals(): Observable<Animal[]> {
    return of(ANIMALS);
  }

  // Récupérer un animal spécifique par son ID
  getAnimalById(id: number): Observable<Animal | undefined> {
    const animal = ANIMALS.find((animal) => animal.id === id);
    return of(animal);
  }

  // Ajouter un animal (pour l'espace admin)
  addAnimal(animal: Animal): void {
    ANIMALS.push(animal);
  }

  // Mettre à jour un animal (pour l'espace vétérinaire ou employé)
  updateAnimal(updatedAnimal: Animal): void {
    const index = ANIMALS.findIndex((animal) => animal.id === updatedAnimal.id);
    if (index !== -1) {
      ANIMALS[index] = updatedAnimal;
    }
  }

  // Supprimer un animal (pour l'espace admin)
  deleteAnimal(id: number): void {
    const index = ANIMALS.findIndex((animal) => animal.id === id);
    if (index !== -1) {
      ANIMALS.splice(index, 1);
    }
  }
}
