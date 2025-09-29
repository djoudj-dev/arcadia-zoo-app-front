import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Animal } from '../../../dashboard/admin-dashboard/animal-management/model/animal.model';

@Injectable({
  providedIn: 'root',
})
export class AnimalOverviewService {
  readonly apiUrl = `${environment.apiUrl}/api/animals`;
  readonly imageBaseUrl = `${environment.apiUrl}/api`; // Base URL pour les images

  constructor(readonly http: HttpClient) {}

  /**
   * Récupère la liste des animaux depuis l'API.
   */
  getAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>(this.apiUrl).pipe(
      map((animals) =>
        animals.map((animal) => ({
          ...animal,
          images: this.formatImageUrl(animal.images, 'animals'),
        }))
      )
    );
  }

  /**
   * Formate l'URL de l'image pour un dossier spécifique (animals, habitats, services).
   * @param imagePath - Chemin de l'image
   * @param folder - Dossier de l'image (ex: 'animals')
   * @returns string - URL complète de l'image
   */
  private formatImageUrl(imagePath: string | null, folder: string = 'animals'): string | null {
    if (!imagePath) return null;

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
}
