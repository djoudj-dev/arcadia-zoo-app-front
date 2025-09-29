import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Animal } from '../../dashboard/admin-dashboard/animal-management/model/animal.model';
import { Habitat } from '../../dashboard/admin-dashboard/habitat-management/model/habitat.model';

@Injectable({
  providedIn: 'root',
})
export class HabitatService {
  /** URL de base pour toutes les images **/
  private readonly imageBaseUrl = `${environment.apiUrl}/api`;

  private readonly apiUrl = `${environment.apiUrl}/api/habitats`;
  private readonly habitatsCache = signal<Habitat[]>([]);

  constructor(private readonly http: HttpClient) {}

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
          images: habitat.images
            ? this.formatImageUrl('habitats', habitat.images)
            : '',
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
      tap(
        (habitat) =>
          habitat?.images &&
          (habitat.images = this.formatImageUrl('habitats', habitat.images))
      )
    );
  }

  /**
   * Récupère les animaux associés à un habitat par ID et construit leurs URLs d'images.
   * @returns Observable<Animal[]>
   * @param habitatId
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

    // Si le chemin contient déjà "uploads", on extrait juste le nom du fichier
    if (imagePath.includes('uploads')) {
      const parts = imagePath.split('/');
      imagePath = parts[parts.length - 1];
    }

    return `${this.imageBaseUrl}/images/${folder}/${imagePath}`;
  }

  clearCache(): void {
    this.habitatsCache.set([]);
  }
}
