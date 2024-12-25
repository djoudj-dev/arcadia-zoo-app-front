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
    console.log('ID:', id);

    // Log des données originales
    console.log('=== DONNÉES ORIGINALES ===');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    // Validation des données d'entrée
    if (!id || !formData) {
      console.error('ID ou FormData manquant');
      return throwError(() => new Error('Données invalides'));
    }

    const preparedFormData = new FormData();

    // Log de la transformation des données
    console.log('=== TRANSFORMATION DES DONNÉES ===');
    formData.forEach((value, key) => {
      switch (key) {
        case 'weightRange':
          console.log(`Conversion ${key} → weight_range:`, value);
          preparedFormData.append('weight_range', value);
          break;
        case 'images': {
          const cleanImagePath =
            (typeof value === 'string' ? value : String(value))
              .split('/')
              .pop() ?? '';
          console.log(`Nettoyage image - Original:`, value);
          console.log(`Nettoyage image - Final:`, cleanImagePath);
          preparedFormData.append('images', cleanImagePath);
          break;
        }
        default:
          console.log(`Copie directe - ${key}:`, value);
          preparedFormData.append(key, value);
      }
    });

    // Log final avant envoi
    console.log('=== DONNÉES PRÉPARÉES POUR ENVOI ===');
    preparedFormData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    return this.http.put<Animal>(`${this.apiUrl}/${id}`, preparedFormData).pipe(
      tap({
        next: (response) => {
          console.log('=== RÉPONSE DU SERVEUR ===');
          console.log('Status: Success');
          console.log('Données reçues:', JSON.stringify(response, null, 2));

          // Vérification détaillée des différences
          const originalData: Record<string, string> = {};
          formData.forEach((value, key) => {
            originalData[key] =
              typeof value === 'string' ? value : String(value);
          });
          const differences = Object.keys(originalData).filter(
            (key) => originalData[key] !== response[key as keyof Animal]
          );

          if (differences.length > 0) {
            console.warn('=== DIFFÉRENCES DÉTECTÉES ===');
            differences.forEach((key) => {
              console.warn(`${key}:`, {
                envoyé: originalData[key],
                reçu: response[key as keyof Animal],
              });
            });
          }
        },
        error: (error) => {
          console.error('=== ERREUR DE REQUÊTE ===');
          console.error('Status:', error.status);
          console.error('Message:', error.message);
          console.error('Erreur complète:', error);
        },
      }),
      map((response: Animal) => {
        if (!response) {
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
        console.log('Animal mappé:', mappedAnimal);
        return mappedAnimal;
      }),
      tap(() => {
        console.log('=== FIN UPDATE ===');
        this.animalService.clearCache();
      }),
      catchError((error) => {
        console.error('=== ERREUR UPDATE ===', error);
        if (error.status === 413) {
          return throwError(() => new Error('Fichier trop volumineux'));
        }
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

    // Si l'URL est déjà complète, la retourner
    if (imagePath.startsWith('http')) return imagePath;

    // Nettoyer le chemin
    const cleanPath = imagePath
      .replace(/^\/+/, '')
      .replace(/^api\/+/, '')
      .replace(/^uploads\/+animals\/+/, '')
      .replace(/\/+/g, '/');

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
    let errorMessage = `Erreur lors de ${action}: `;

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage += `Une erreur est survenue: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage += `Le serveur a retourné: ${error.status} - ${error.statusText}`;
      if (error.error?.message) {
        errorMessage += `\nDétail: ${error.error.message}`;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
