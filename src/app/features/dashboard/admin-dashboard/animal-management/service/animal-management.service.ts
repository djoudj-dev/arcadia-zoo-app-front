import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
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
  private readonly apiUrl = `${environment.apiUrl}/api/admin/animal-management`;

  constructor(
    private readonly http: HttpClient,
    private readonly animalService: AnimalService
  ) {}

  getAllAnimals(): Observable<Animal[]> {
    return this.http
      .get<Animal[]>(this.apiUrl)
      .pipe(
        catchError((error) => this.handleError('chargement des animaux', error))
      );
  }

  createAnimal(formData: FormData): Observable<Animal> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });

    const animalData: Record<string, string | Blob> = {};
    formData.forEach((value, key) => {
      if (key === 'weightRange') {
        animalData['weight_range'] = value;
      } else {
        animalData[key] = value;
      }
    });

    return this.http.post<Animal>(this.apiUrl, formData, { headers }).pipe(
      tap(() => this.animalService.clearCache()),
      catchError((error) => this.handleError("création de l'animal", error))
    );
  }

  updateAnimal(id: string, formData: FormData): Observable<Animal> {
    if (!id || !formData) {
      return throwError(() => new Error('Données invalides'));
    }

    const headers = new HttpHeaders({
      Accept: 'application/json',
    });

    const animalData: Record<string, string | Blob> = {};
    formData.forEach((value, key) => {
      if (key === 'weightRange') {
        animalData['weight_range'] = value;
      } else {
        animalData[key] = value;
      }
    });

    console.log('Données envoyées pour mise à jour:', {
      id,
      data: animalData,
    });

    return this.http
      .put<Animal>(`${this.apiUrl}/${id}`, animalData, { headers })
      .pipe(
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
