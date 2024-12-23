import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../../../environments/environment.development';
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
  /** URL de base pour les endpoints de gestion des animaux */
  private readonly apiUrl = `${environment.apiUrl}/api/admin/animal-management`;

  constructor(
    private readonly http: HttpClient,
    private readonly animalService: AnimalService
  ) {}

  /**
   * Récupère la liste complète des animaux
   * @returns Observable<Animal[]> Liste des animaux avec leurs informations complètes
   */
  getAllAnimals(): Observable<Animal[]> {
    return this.http
      .get<Animal[]>(this.apiUrl)
      .pipe(
        catchError((error) => this.handleError('chargement des animaux', error))
      );
  }

  /**
   * Crée un nouvel animal
   * @param formData FormData contenant les données de l'animal et son image
   * @returns Observable<Animal> Animal créé avec ses informations complètes
   */
  createAnimal(formData: FormData): Observable<Animal> {
    return this.http.post<Animal>(this.apiUrl, formData).pipe(
      tap(() => this.animalService.clearCache()),
      catchError((error) => this.handleError("création de l'animal", error))
    );
  }

  /**
   * Met à jour un animal existant
   * @param id Identifiant de l'animal à modifier
   * @param formData FormData contenant les données mises à jour et la nouvelle image éventuelle
   * @returns Observable<Animal> Animal mis à jour avec ses informations complètes
   */
  updateAnimal(id: string, formData: FormData): Observable<Animal> {
    return this.http.put<Animal>(`${this.apiUrl}/${id}`, formData).pipe(
      tap((response) => {
        console.log('Réponse brute du serveur:', response);
      }),
      map((response) => {
        if (!response || typeof response === 'string') {
          // Reconstruire l'objet animal à partir du FormData
          const animal: Partial<Animal> = {};
          formData.forEach((value, key) => {
            if (key === 'id_animal') {
              animal[key] = parseInt(value as string);
            } else {
              (animal as Record<string, unknown>)[key] = value;
            }
          });
          return {
            ...(animal as Animal),
            images: this.formatImageUrl(animal.images as string),
          };
        }
        return {
          ...response,
          images: this.formatImageUrl(response.images),
        };
      }),
      tap(() => this.animalService.clearCache()),
      catchError((error) => {
        console.error('Erreur de mise à jour:', error);
        return this.handleError("mise à jour de l'animal", error);
      })
    );
  }

  /**
   * Supprime un animal
   * @param id Identifiant de l'animal à supprimer
   * @returns Observable<void>
   */
  deleteAnimal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.animalService.clearCache()),
      catchError((error) => this.handleError("suppression de l'animal", error))
    );
  }

  /**
   * Format l'URL de l'image si nécessaire
   * @param imagePath Chemin de l'image
   * @returns URL complète ou chemin vide
   */
  private formatImageUrl(imagePath: string | null): string {
    if (!imagePath) return '';

    // Si l'URL contient déjà le domaine complet, la retourner telle quelle
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // Nettoyer le chemin en enlevant les préfixes en double
    const cleanPath = imagePath
      .replace(/^\/+/, '') // Enlève les slashes au début
      .replace(/^api\/+/, '') // Enlève 'api/' au début
      .replace(/^uploads\/+/, '') // Enlève 'uploads/' au début
      .replace(/\/+/g, '/'); // Remplace les slashes multiples par un seul

    // Construire l'URL complète
    return `${environment.apiUrl}/api/uploads/animals/${cleanPath}`;
  }

  /**
   * Gestion centralisée des erreurs HTTP
   * @param action Description de l'action qui a échoué
   * @param error Erreur HTTP reçue
   * @returns Observable<never>
   */
  private handleError(
    action: string,
    error: HttpErrorResponse
  ): Observable<never> {
    const errorMessage =
      error.error instanceof ErrorEvent
        ? `Erreur client lors de ${action}: ${error.error.message}`
        : `Erreur serveur lors de ${action}: Code ${error.status}, ${
            error.error?.message || error.message
          }`;
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
