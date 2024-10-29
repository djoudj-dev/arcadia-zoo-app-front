import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Animal } from '../../../core/models/animal.model';
import { Observable, ReplaySubject } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AnimalService {
  private apiUrl = `${environment.apiUrl}/api/animals`;
  private uploadsUrl = `${environment.apiUrl}/uploads`; // URL de base pour les images
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
              image: `${this.uploadsUrl}/${animal.image}`,
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

  /**
   * Récupère un animal spécifique par son ID en utilisant le cache si possible.
   * @param id L'identifiant de l'animal à récupérer.
   */
  getAnimalById(id: number): Observable<Animal | undefined> {
    return this.getAnimals().pipe(
      map((animals) => animals.find((animal) => animal.id === id))
    );
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
      .put<Animal>(`${this.apiUrl}/${updatedAnimal.id}`, updatedAnimal)
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
}
