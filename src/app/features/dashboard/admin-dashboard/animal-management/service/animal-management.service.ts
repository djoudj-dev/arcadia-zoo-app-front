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
    console.log('=== DÉBUT UPDATE ===');

    // Préparation des données pour correspondre au format attendu par le backend
    const preparedFormData = new FormData();
    formData.forEach((value, key) => {
      // Log de chaque paire clé-valeur
      console.log(`Donnée originale - ${key}:`, value);

      // Conversion des clés pour correspondre au format du backend
      switch (key) {
        case 'weightRange':
          console.log('Conversion weightRange → weight_range');
          preparedFormData.append('weight_range', value);
          break;
        case 'veterinary':
          console.log('Conversion veterinary → vet_note');
          preparedFormData.append('vet_note', value);
          break;
        default:
          console.log(`Pas de conversion pour ${key}`);
          preparedFormData.append(key, value);
      }
    });
    // Log du FormData préparé
    console.log('FormData préparé:');
    preparedFormData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    return this.http.put<Animal>(`${this.apiUrl}/${id}`, preparedFormData).pipe(
      tap((response) => {
        console.log('Réponse brute du serveur:', response);
      }),
      map((response: Animal) => {
        // Vérification de la réponse
        if (!response) {
          console.error('Réponse vide du serveur');
          throw new Error('Réponse vide du serveur');
        }

        const mappedAnimal = {
          id_animal: response.id_animal,
          name: response.name,
          species: response.species,
          characteristics: response.characteristics,
          diet: response.diet,
          weightRange: response.weightRange,
          habitat_id: response.habitat_id,
          veterinary: response.veterinary,
          images: this.formatImageUrl(response.images),
          created_at: response.created_at,
          updated_at: response.updated_at,
        };
        console.log('Animal après mapping:', mappedAnimal);
        return mappedAnimal;
      }),
      tap(() => {
        console.log('=== FIN UPDATE ===');
        this.animalService.clearCache();
      }),
      catchError((error) => {
        console.error('=== ERREUR UPDATE ===');
        console.error('Détails:', error);
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
      .replace(/^animals\/+/, '') // Enlève 'animals/' au début
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
