import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
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
  readonly apiUrl = `${environment.apiUrl}/api/admin/habitats`;

  constructor(
    readonly http: HttpClient,
    readonly habitatService: HabitatService
  ) {}

  /**
   * Récupère la liste complète des habitats
   * Utilise le cache si disponible pour optimiser les performances
   * @returns Observable<Habitat[]> Liste des habitats avec leurs informations complètes
   */
  getAllHabitats(): Observable<Habitat[]> {
    return this.http.get<Habitat[]>(this.apiUrl).pipe(
      tap((response) => console.log('Habitats reçus:', response)),
      catchError((error) => this.handleError('chargement des habitats', error))
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
      tap((response) => {
        console.log('Réponse du serveur (création):', response);
        this.habitatService.clearCache();
      }),
      catchError((error) => {
        console.error('Erreur détaillée (création):', error);
        return this.handleError("création de l'habitat", error);
      })
    );
  }

  /**
   * Met à jour un habitat existant
   * Gère l'upload d'image et la mise à jour du cache
   * @param id Identifiant de l'habitat à modifier
   * @param formData FormData contenant les données mises à jour et la nouvelle image éventuelle
   * @returns Observable<Habitat> Habitat mis à jour avec ses informations complètes
   */
  updateHabitat(
    id: string,
    data: Record<string, string | Blob>
  ): Observable<Habitat> {
    if (!id || !data) {
      return throwError(() => new Error('Données invalides'));
    }

    const headers = new HttpHeaders({
      Accept: 'application/json',
    });

    console.log('Données envoyées pour mise à jour:', {
      id,
      data,
    });

    return this.http
      .put<Habitat>(`${this.apiUrl}/${id}`, data, { headers })
      .pipe(
        tap((response) => {
          console.log('Réponse du serveur (mise à jour):', response);
          this.habitatService.clearCache();
        }),
        catchError((error) => {
          console.error('Erreur détaillée (mise à jour):', error);
          if (error.status === 413) {
            return throwError(() => new Error('Fichier trop volumineux'));
          }
          return this.handleError("mise à jour de l'habitat", error);
        })
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
      tap(() => {
        console.log('Habitat supprimé avec succès:', id);
        this.habitatService.clearCache();
      }),
      catchError((error) => {
        console.error('Erreur lors de la suppression:', error);
        return this.handleError("suppression de l'habitat", error);
      })
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
    let errorMessage = `Erreur lors de ${action}. `;

    if (error.error instanceof ErrorEvent) {
      errorMessage += `Message d'erreur: ${error.error.message}`;
    } else {
      errorMessage += `Code d'erreur: ${error.status}, `;
      errorMessage += `Message: ${error.error?.message || error.message}`;
    }

    console.error(errorMessage);
    console.error("Détails complets de l'erreur:", error);

    return throwError(() => new Error(errorMessage));
  }
}
