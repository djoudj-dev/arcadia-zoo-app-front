import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../../../environments/environment.development';
import { HabitatService } from '../../../../habitats/service/habitat.service';
import { Habitat } from '../model/habitat.model';

/**
 * Service de gestion des habitats
 * Fournit les opérations CRUD pour la gestion des habitats du zoo
 * Gère également le cache des données et les images
 */
@Injectable({
  providedIn: 'root',
})
export class HabitatManagementService {
  /** URL de base pour les endpoints de gestion des habitats */
  private apiUrl = `${environment.apiUrl}/api/admin/habitat-management`;

  constructor(
    private http: HttpClient,
    private habitatService: HabitatService
  ) {}

  /**
   * Récupère la liste complète des habitats
   * Utilise le cache si disponible pour optimiser les performances
   * @returns Observable<Habitat[]> Liste des habitats avec leurs informations complètes
   */
  getAllHabitats(): Observable<Habitat[]> {
    return this.http
      .get<Habitat[]>(this.apiUrl)
      .pipe(
        catchError((error) =>
          this.handleError('chargement des habitats', error)
        )
      );
  }

  /**
   * Crée un nouvel habitat
   * Gère l'upload d'image et la mise à jour du cache
   * @param formData FormData contenant les données de l'habitat et son image
   * @returns Observable<Habitat> Habitat créé avec ses informations complètes
   */
  createHabitat(formData: FormData): Observable<Habitat> {
    return this.http.post<Habitat>(this.apiUrl, formData).pipe(
      tap(() => this.habitatService.clearCache()), // Vide le cache après création
      catchError((error) => this.handleError("création de l'habitat", error))
    );
  }

  /**
   * Met à jour un habitat existant
   * Gère l'upload d'image et la mise à jour du cache
   * @param id Identifiant de l'habitat à modifier
   * @param formData FormData contenant les données mises à jour et la nouvelle image éventuelle
   * @returns Observable<Habitat> Habitat mis à jour avec ses informations complètes
   */
  updateHabitat(id: string, formData: FormData): Observable<Habitat> {
    return this.http.put<Habitat>(`${this.apiUrl}/${id}`, formData).pipe(
      tap(() => this.habitatService.clearCache()), // Vide le cache après modification
      catchError((error) => this.handleError("mise à jour de l'habitat", error))
    );
  }

  /**
   * Supprime un habitat
   * Met à jour le cache après la suppression
   * @param id Identifiant de l'habitat à supprimer
   * @returns Observable<void>
   */
  deleteHabitat(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.habitatService.clearCache()), // Vide le cache après suppression
      catchError((error) => this.handleError("suppression de l'habitat", error))
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
