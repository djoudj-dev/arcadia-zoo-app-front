import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import { Animal } from '../../dashboard/admin-dashboard/animal-management/model/animal.model';
import { Habitat } from '../../dashboard/admin-dashboard/habitat-management/model/habitat.model';

@Injectable({
  providedIn: 'root',
})
export class HabitatService {
  /** URL de base pour toutes les images **/
  private imageBaseUrl = `${environment.apiUrl}/api`;

  private apiUrl = `${environment.apiUrl}/api/habitats`;
  private habitatsCache = signal<Habitat[]>([]);

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les habitats et construit les URLs complètes des images.
   * @returns Observable<Habitat[]>
   */
  getHabitats(): Observable<Habitat[]> {
    const cachedHabitats = this.habitatsCache();
    if (cachedHabitats.length > 0) {
      return of(cachedHabitats);
    }
    return this.http.get<Habitat[]>(this.apiUrl).pipe(
      map((habitats) =>
        habitats.map((habitat) => ({
          ...habitat,
          images: this.formatImageUrl('habitats', habitat.images),
        }))
      ),
      tap((habitats) => this.habitatsCache.set(habitats))
    );
  }

  /**
   * Récupère un habitat par son ID et construit l'URL complète de son image.
   * @param id - ID de l'habitat
   * @returns Observable<Habitat | undefined>
   */
  getHabitatById(id: number): Observable<Habitat | undefined> {
    return this.getHabitats().pipe(
      map((habitats) => habitats.find((habitat) => habitat.id_habitat === id)),
      tap((habitat) => {
        if (habitat) {
          habitat.images = this.formatImageUrl('habitats', habitat.images);
        }
      })
    );
  }

  /**
   * Récupère les animaux associés à un habitat par ID et construit leurs URLs d'images.
   * @param animalId - ID de l'animal
   * @returns Observable<Animal[]>
   */
  getAnimalsByHabitatId(habitatId: number): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.apiUrl}/${habitatId}/animals`).pipe(
      map((animals) =>
        animals.map((animal) => ({
          ...animal,
          // Utilise formatImageUrl pour ajouter correctement l'URL de base
          images: animal.images
            ? this.formatImageUrl('animals', animal.images)
            : '',
        }))
      )
    );
  }

  /**
   * Formate l'URL de l'image pour un dossier spécifique (habitats, animals).
   * @param folder - Dossier de l'image (ex: 'animals' ou 'habitats')
   * @param imagePath - Chemin de l'image
   * @returns string - URL complète de l'image
   */
  private formatImageUrl(folder: string, imagePath: string): string {
    // Si l'URL de l'image commence déjà par "http" ou "https", ne rien ajouter
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }
    return `${this.imageBaseUrl}/${imagePath}`;
  }

  clearCache(): void {
    this.habitatsCache.set([]);
  }
}
