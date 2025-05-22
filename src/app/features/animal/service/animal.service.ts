import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Animal } from 'app/features/dashboard/admin-dashboard/animal-management/model/animal.model';
import { Habitat } from 'app/features/dashboard/admin-dashboard/habitat-management/model/habitat.model';
import { environment } from 'environments/environment';
import { map, Observable, tap } from 'rxjs';
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
  private readonly apiUrl = `${environment.apiUrl}/api/animals`;

  /** URL de base de l'API des habitats */
  private readonly habitatUrl = `${environment.apiUrl}/api/habitats`;

  /** URL de base pour les images */
  private readonly imageBaseUrl = `${environment.apiUrl}/api`;

  // Signaux pour le cache
  private readonly animalsSignal = signal<Animal[]>([]);
  private readonly cacheLoadedSignal = signal<boolean>(false);

  constructor(readonly http: HttpClient) {}

  /**
   * Formate l'URL de l'image pour un dossier spécifique (animals, habitats, services).
   * @param folder - Dossier de l'image (ex: 'animals')
   * @param imagePath - Chemin de l'image
   * @returns string - URL complète de l'image
   */
  private formatImageUrl(imagePath: string | null, folder: string = 'animals'): string {
    if (!imagePath) return '';

    // Si l'URL de l'image commence déjà par "http" ou "https", ne rien ajouter
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }

    // Si le chemin contient déjà "uploads", on extrait juste le nom du fichier
    if (imagePath.includes('uploads')) {
      const parts = imagePath.split('/');
      imagePath = parts[parts.length - 1];
    }

    return `${this.imageBaseUrl}/uploads/${folder}/${imagePath}`;
  }

  /**
   * Récupère la liste de tous les animaux.
   * Utilise un cache pour éviter les appels réseau répétés.
   */
  getAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>(this.apiUrl).pipe(
      map((animals) =>
        animals.map((animal) => ({
          ...animal,
          images: this.formatImageUrl(animal.images, 'animals'),
        }))
      ),
      tap((animals) => {
        this.animalsSignal.set(animals);
        this.cacheLoadedSignal.set(true);
      })
    );
  }

  /**
   * Récupère un animal par son ID.
   * Les images sont déjà formatées par getAnimals().
   * @param id - ID de l'animal à récupérer
   * @returns Observable<Animal | undefined> - L'animal trouvé ou undefined
   */
  getAnimalById(id: number): Observable<Animal | undefined> {
    return this.getAnimals().pipe(
      map((animals) => animals.find((animal) => animal.id_animal === id))
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
    this.animalsSignal.set([]);
    this.cacheLoadedSignal.set(false);
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
