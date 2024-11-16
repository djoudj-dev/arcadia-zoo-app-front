import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Animal } from 'app/features/dashboard/admin-dashboard/animal-management/model/animal.model';
import { Habitat } from 'app/features/dashboard/admin-dashboard/habitat-management/model/habitat.model';
import { environment } from 'environments/environment.development';
import { map, Observable, ReplaySubject, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnimalService {
  private apiUrl = `${environment.apiUrl}/api/animals`;
  private habitatUrl = `${environment.apiUrl}/api/habitats`; // URL de base pour les habitats
  private uploadsUrl = `${environment.apiUrl}/api/uploads`; // URL de base pour les images
  private animalsCache$ = new ReplaySubject<Animal[]>(1); // Cache pour optimiser les requêtes
  private cacheLoaded = false; // Drapeau pour indiquer si le cache est chargé

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste de tous les animaux.
   * Utilise un cache pour éviter les appels réseau répétés.
   */
  getAnimals(): Observable<Animal[]> {
    if (!this.cacheLoaded) {
      this.http
        .get<Animal[]>(this.apiUrl)
        .pipe(
          // Ajoute l'URL complète de l'image pour chaque animal
          map((animals) =>
            animals.map((animal) => ({
              ...animal,
              image: animal.images
                ? `${environment.apiUrl}/uploads/animals/${animal.images}`
                : '',
            }))
          ),
          shareReplay(1), // Partage les données entre tous les abonnés pour une seule requête
          tap((animals) => {
            this.animalsCache$.next(animals); // Met à jour le cache
            this.cacheLoaded = true; // Indique que le cache est chargé
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

        // Vérifie si l'animal existe et formate l'URL de l'image si nécessaire
        if (animal && animal.images) {
          animal.images = animal.images.startsWith('http')
            ? animal.images
            : `${environment.apiUrl}/api/${animal.images}`;
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

  markAnimalAsFed(animalId: number): Observable<Animal> {
    return this.http.post<Animal>(`${this.apiUrl}/${animalId}/feed`, {});
  }
}
