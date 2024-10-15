import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HABITATS } from '../../../core/mocks/habitats-mock.component';
import { Habitat } from '../../../core/models/habitat.model';

@Injectable({
  providedIn: 'root',
})
export class HabitatService {
  constructor() {}

  // Récupérer la liste de tous les habitats
  getHabitats(): Observable<Habitat[]> {
    return of(HABITATS);
  }

  // Récupérer un habitat spécifique par son ID
  getHabitatById(id: number): Observable<Habitat | undefined> {
    const habitat = HABITATS.find((habitat) => habitat.id === id);
    return of(habitat);
  }

  // Ajouter un habitat (pour l'espace admin)
  addHabitat(habitat: Habitat): void {
    HABITATS.push(habitat);
  }

  // Mettre à jour un habitat (pour l'espace vétérinaire ou employé)
  updateHabitat(updatedHabitat: Habitat): void {
    const index = HABITATS.findIndex(
      (habitat) => habitat.id === updatedHabitat.id
    );
    if (index !== -1) {
      HABITATS[index] = updatedHabitat;
    }
  }

  // Supprimer un habitat (pour l'espace admin)
  deleteHabitat(id: number): void {
    const index = HABITATS.findIndex((habitat) => habitat.id === id);
    if (index !== -1) {
      HABITATS.splice(index, 1);
    }
  }
}
