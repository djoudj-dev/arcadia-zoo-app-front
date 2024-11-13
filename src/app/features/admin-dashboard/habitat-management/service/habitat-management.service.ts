import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { HabitatService } from '../../../habitats/service/habitat.service';
import { Habitat } from '../model/habitat.model';

@Injectable({
  providedIn: 'root',
})
export class HabitatManagementService {
  private apiUrl = `${environment.apiUrl}/api/admin/habitat-management`;

  constructor(
    private http: HttpClient,
    private habitatService: HabitatService
  ) {}

  /**
   * Récupère la liste complète des habitats.
   * Utilise le cache du service général d'Habitats pour éviter les doublons.
   */
  getAllHabitats(): Observable<Habitat[]> {
    return this.http.get<Habitat[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des habitats :', error);
        return throwError(
          () => new Error('Erreur lors de la récupération des habitats')
        );
      })
    );
  }

  /**
   * Crée un nouvel habitat et vide le cache pour forcer un rechargement.
   * @param formData Les données de l'habitat sous forme de FormData.
   */
  createHabitat(formData: FormData): Observable<Habitat> {
    return this.http.post<Habitat>(this.apiUrl, formData).pipe(
      tap(() => this.habitatService.clearCache()),
      catchError((error) => {
        console.error("Erreur lors de la création de l'habitat :", error);
        return throwError(
          () => new Error("Erreur lors de la création de l'habitat")
        );
      })
    );
  }

  /**
   * Met à jour un habitat existant et vide le cache.
   * @param id L'identifiant de l'habitat à mettre à jour.
   * @param formData Les nouvelles données de l'habitat sous forme de FormData.
   */
  updateHabitat(id: string, formData: FormData): Observable<Habitat> {
    return this.http.put<Habitat>(`${this.apiUrl}/${id}`, formData).pipe(
      tap(() => this.habitatService.clearCache()), // Vide le cache des habitats
      catchError((error) => {
        console.error("Erreur lors de la mise à jour de l'habitat :", error);
        return throwError(
          () => new Error("Erreur lors de la mise à jour de l'habitat")
        );
      })
    );
  }

  /**
   * Supprime un habitat et vide le cache.
   * @param id L'identifiant de l'habitat à supprimer.
   */
  deleteHabitat(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.habitatService.clearCache()), // Vide le cache des habitats
      catchError((error) => {
        console.error("Erreur lors de la suppression de l'habitat :", error);
        return throwError(
          () => new Error("Erreur lors de la suppression de l'habitat")
        );
      })
    );
  }
}
