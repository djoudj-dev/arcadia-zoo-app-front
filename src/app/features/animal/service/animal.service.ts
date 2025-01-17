import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Animal } from 'app/features/dashboard/admin-dashboard/animal-management/model/animal.model';
import { Habitat } from 'app/features/dashboard/admin-dashboard/habitat-management/model/habitat.model';
import { environment } from 'environments/environment';
import { map, Observable, ReplaySubject, shareReplay, tap } from 'rxjs';
import { FeedingData } from '../../dashboard/employe-dashboard/animal-feeding-management/models/feeding-data.model';

/**
 * Service gérant les opérations liées aux animaux
 * Fournit des méthodes pour interagir avec l'API des animaux
 */
@Injectable({
  providedIn: 'root',
})
export class AnimalService {
  /** URL de base de l'API des animaux */
  readonly apiUrl = `${environment.apiUrl}/api/animals`;

  /** URL de base de l'API des habitats */
  readonly habitatUrl = `${environment.apiUrl}/api/habitats`;

  /** URL de base pour les images */
  readonly imageBaseUrl = `${environment.apiUrl}/api/uploads/animals`;

  /** Cache pour stocker les données des animaux */
  readonly animalsCache$ = new ReplaySubject<Animal[]>(1);

  /** Indique si le cache est chargé */
  private cacheLoaded = false;

  constructor(readonly http: HttpClient) {}

  private formatImageUrl(imagePath: string | null): string {
    if (!imagePath) return '';
    return imagePath.startsWith('http')
      ? imagePath
      : `${this.imageBaseUrl}/${imagePath.replace(/^.*\//, '')}`;
  }

  /**
   * Récupère la liste de tous les animaux.
   * Utilise un cache pour éviter les appels réseau répétés.
   */
  getAnimals(): Observable<Animal[]> {
    if (!this.cacheLoaded) {
      this.http
        .get<Animal[]>(this.apiUrl)
        .pipe(
          map((animals) =>
            animals.map((animal) => ({
              ...animal,
              images: this.formatImageUrl(animal.images),
            }))
          ),
          shareReplay(1),
          tap((animals) => {
            this.animalsCache$.next(animals);
            this.cacheLoaded = true;
          })
        )
        .subscribe();
    }
    return this.animalsCache$;
  }

  getAnimalById(id: number): Observable<Animal | undefined> {
    return this.getAnimals().pipe(
      map((animals) => {
        const animal = animals.find((animal) => animal.id_animal === id);
        if (animal?.images) {
          animal.images = animal.images.startsWith('http')
            ? animal.images
            : `${this.imageBaseUrl}/${animal.images}`;
        }
        return animal;
      })
    );
  }

  /**
   * Récupère un habitat spécifique par son ID depuis le backend.
   * @param habitat_id - Identifiant de l'habitat
   * @returns Observable<Habitat> - Flux de l'habitat récupéré
   */
  getHabitatById(habitat_id: number): Observable<Habitat> {
    return this.http.get<Habitat>(`${this.habitatUrl}/${habitat_id}`);
  }

  /**
   * Ajoute un nouvel animal.
   * Vide le cache pour forcer un rechargement lors du prochain appel à `getAnimals`.
   * @param animal Les données de l'animal à ajouter.
   */
  addAnimal(animal: Animal): Observable<Animal> {
    return this.http.post<Animal>(this.apiUrl, animal).pipe(
      tap(() => this.clearCache()) // Efface le cache après ajout
    );
  }

  /**
   * Met à jour un animal existant.
   * Vide le cache pour forcer un rechargement lors du prochain appel à `getAnimals`.
   * @param updatedAnimal Les données mises à jour de l'animal.
   */
  updateAnimal(updatedAnimal: Animal): Observable<Animal> {
    return this.http
      .put<Animal>(`${this.apiUrl}/${updatedAnimal.id_animal}`, updatedAnimal)
      .pipe(
        tap(() => this.clearCache()) // Efface le cache après mise à jour
      );
  }

  /**
   * Supprime un animal.
   * Vide le cache pour forcer un rechargement lors du prochain appel à `getAnimals`.
   * @param id L'identifiant de l'animal à supprimer.
   */
  deleteAnimal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.clearCache()) // Efface le cache après suppression
    );
  }

  /**
   * Vide le cache des animaux pour forcer un rechargement depuis l'API.
   * Appelé après la création, modification ou suppression d'un animal.
   */
  clearCache(): void {
    this.animalsCache$.next([]);
    this.cacheLoaded = false; // Réinitialise le drapeau pour indiquer que le cache doit être rechargé
  }

  markAnimalAsFed(
    animalId: number,
    feedingData?: FeedingData
  ): Observable<Animal> {
    return this.http.post<Animal>(`${this.apiUrl}/${animalId}/feeding`, {
      ...feedingData,
      feedingTime: new Date(),
      animalId: animalId,
    });
  }
}
