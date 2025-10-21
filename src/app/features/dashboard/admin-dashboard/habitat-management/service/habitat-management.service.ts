import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
    private readonly http: HttpClient,
    private readonly habitatService: HabitatService
  ) {}

  /**
   * Récupère la liste complète des habitats
   * Utilise le cache si disponible pour optimiser les performances
   * @returns Observable<Habitat[]> Liste des habitats avec leurs informations complètes
   */
  getAllHabitats(): Observable<Habitat[]> {
    return this.http.get<Habitat[]>(this.apiUrl).pipe(
      tap(() => {
      }),
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
        this.habitatService.clearCache();
      }),
      catchError((error) => {
        return this.handleError("création de l'habitat", error);
      })
    );
  }

  /**
   * Met à jour un habitat existant
   * Gère l'upload d'image et la mise à jour du cache
   * @param id Identifiant de l'habitat à modifier
   * @param data FormData contenant les données mises à jour et la nouvelle image éventuelle
   * @param image
   * @returns Observable<Habitat> Habitat mis à jour avec ses informations complètes
   */
  updateHabitat(
    id: string,
    data: Partial<Habitat>,
    image?: File | null
  ): Observable<Habitat> {
    if (!id) {
      return throwError(() => new Error('ID invalide'));
    }

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'images') {
        formData.append(
          key,
          typeof value === 'object' ? JSON.stringify(value) : String(value)
        );
      }
    });

    if (image) {
      formData.append('images', image);
    }

    return this.http.put<Habitat>(`${this.apiUrl}/${id}`, formData).pipe(
      tap((response) => {
        this.habitatService.clearCache();
      }),
      catchError((error) => {
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
        this.habitatService.clearCache();
      }),
      catchError((error) => {
        return this.handleError("suppression de l'habitat", error);
      })
    );
  }

  /**
   * Gestion centralisée des erreurs HTTP
   * Formate les messages d'erreur et les log pour le debugging
   * @param operation Description de l'opération qui a échoué
   * @param error Erreur HTTP reçue
   * @returns Observable<never> Observable d'erreur formatée
   */
  private handleError(
    operation: string,
    error: HttpErrorResponse
  ): Observable<never> {
    return throwError(() => new Error(`Erreur lors de ${operation}`));
  }
}
