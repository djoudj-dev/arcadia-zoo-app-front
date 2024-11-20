import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
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
  private apiUrl = `${environment.apiUrl}/api/admin/animal-management`;

  constructor(private http: HttpClient, private animalService: AnimalService) {}

  /**
   * Récupère la liste complète des animaux
   * Utilise le cache si disponible pour optimiser les performances
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
   * Gère l'upload d'image et la mise à jour du cache
   * @param formData FormData contenant les données de l'animal et son image
   * @returns Observable<Animal> Animal créé avec ses informations complètes
   */
  createAnimal(formData: FormData): Observable<Animal> {
    return this.http.post<Animal>(this.apiUrl, formData).pipe(
      tap(() => this.animalService.clearCache()), // Vide le cache après création
      catchError((error) => this.handleError("'création de l'animal'", error))
    );
  }

  /**
   * Met à jour un animal existant
   * Gère l'upload d'image et la mise à jour du cache
   * @param id Identifiant de l'animal à modifier
   * @param formData FormData contenant les données mises à jour et la nouvelle image éventuelle
   * @returns Observable<Animal> Animal mis à jour avec ses informations complètes
   */
  updateAnimal(id: string, formData: FormData): Observable<Animal> {
    return this.http.put<Animal>(`${this.apiUrl}/${id}`, formData).pipe(
      tap(() => this.animalService.clearCache()), // Vide le cache après modification
      catchError((error) =>
        this.handleError("'mise à jour de l'animal'", error)
      )
    );
  }

  /**
   * Supprime un animal
   * Met à jour le cache après la suppression
   * @param id Identifiant de l'animal à supprimer
   * @returns Observable<void>
   */
  deleteAnimal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.animalService.clearCache()), // Vide le cache après suppression
      catchError((error) =>
        this.handleError("'suppression de l'animal'", error)
      )
    );
  }

  /**
   * Gestion centralisée des erreurs HTTP
   * Formate les messages d'erreur et les log pour le debugging
   * @param action Description de l'action qui a échoué
   * @param error Erreur HTTP reçue
   * @returns Observable<never> Observable d'erreur formatée
   */
  private handleError(
    action: string,
    error: HttpErrorResponse
  ): Observable<never> {
    console.error(`Erreur lors de ${action} :`, error);
    return throwError(() => new Error(`Erreur lors de ${action}.`));
  }
}
