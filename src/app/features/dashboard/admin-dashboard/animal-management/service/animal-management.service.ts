import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { AnimalService } from '../../../../animal/service/animal.service';
import { Animal } from '../model/animal.model';

/**
 * Service de gestion des animaux
 * Fournit les opérations CRUD pour la gestion des animaux du zoo
 * Gère également le cache des données et les images
 */
@Injectable({
  providedIn: 'root',
})
export class AnimalManagementService {
  private readonly apiUrl = `${environment.apiUrl}/api/admin/animals`;
  private readonly imageBaseUrl = `${environment.apiUrl}/api`;

  constructor(
    private readonly http: HttpClient,
    private readonly animalService: AnimalService
  ) {}

  getAllAnimals(): Observable<Animal[]> {
    return this.http
      .get<Animal[]>(this.apiUrl)
      .pipe(
        map((animals) =>
          animals.map((animal) => ({
            ...animal,
            images: this.formatImageUrl(animal.images, 'animals')
          }))
        ),
        catchError((error) => this.handleError('chargement des animaux', error))
      );
  }

  createAnimal(formData: FormData): Observable<Animal> {
    return this.http.post<Animal>(this.apiUrl, formData).pipe(
      tap(() => this.animalService.clearCache()),
      catchError((error) => this.handleError("création de l'animal", error))
    );
  }

  updateAnimal(id: string, formData: FormData): Observable<Animal> {
    if (!id) {
      return throwError(() => new Error('ID invalide'));
    }

    // Créer un nouvel objet FormData pour les données à envoyer
    const dataToSend = new FormData();

    // Ajouter les champs de base
    formData.forEach((value, key) => {
      if (key === 'images' && value instanceof File) {
        dataToSend.append('images', value);
      } else if (key !== 'showTime' && value !== null && value !== undefined) {
        dataToSend.append(
          key,
          typeof value === 'object' ? JSON.stringify(value) : String(value)
        );
      }
    });

    console.log('Données à envoyer:', {
      id,
      name: dataToSend.get('name'),
      species: dataToSend.get('species'),
    });

    return this.http.put<Animal>(`${this.apiUrl}/${id}`, dataToSend).pipe(
      tap((response) => {
        console.log('Réponse du serveur (mise à jour):', response);
        this.animalService.clearCache();
      }),
      catchError((error) => {
        console.error('Erreur détaillée (mise à jour):', error);
        if (error.status === 413) {
          return throwError(() => new Error('Fichier trop volumineux'));
        }
        return this.handleError("mise à jour de l'animal", error);
      })
    );
  }

  deleteAnimal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.animalService.clearCache()),
      catchError((error) => this.handleError("suppression de l'animal", error))
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

    return `${this.imageBaseUrl}/uploads/${folder}/${imagePath}`;
  }

  private handleError(
    action: string,
    error: HttpErrorResponse
  ): Observable<never> {
    let errorMessage = `Erreur lors de ${action}: `;

    if (error.error instanceof ErrorEvent) {
      errorMessage += `Une erreur est survenue: ${error.error.message}`;
    } else {
      errorMessage += `Le serveur a retourné: ${error.status} - ${error.statusText}`;
      if (error.error?.message) {
        errorMessage += `\nDétail: ${error.error.message}`;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
