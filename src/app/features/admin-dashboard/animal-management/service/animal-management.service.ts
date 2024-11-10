import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AnimalService } from '../../../animal/service/animal.service';
import { Animal } from '../model/animal.model';

@Injectable({
  providedIn: 'root',
})
export class AnimalManagementService {
  private apiUrl = `${environment.apiUrl}/admin/animal-management`;

  constructor(private http: HttpClient, private animalService: AnimalService) {}

  /** Récupère tous les animaux en utilisant le cache **/
  getAllAnimals(): Observable<Animal[]> {
    return this.http
      .get<Animal[]>(this.apiUrl)
      .pipe(
        catchError((error) => this.handleError('chargement des animaux', error))
      );
  }

  /** Crée un nouvel animal et vide le cache **/
  createAnimal(formData: FormData): Observable<Animal> {
    return this.http.post<Animal>(this.apiUrl, formData).pipe(
      tap(() => this.animalService.clearCache()),
      catchError((error) => this.handleError('création de l’animal', error))
    );
  }

  /** Met à jour un animal existant et vide le cache **/
  updateAnimal(id: string, formData: FormData): Observable<Animal> {
    return this.http.put<Animal>(`${this.apiUrl}/${id}`, formData).pipe(
      tap(() => this.animalService.clearCache()),
      catchError((error) => this.handleError('mise à jour de l’animal', error))
    );
  }

  /** Supprime un animal et vide le cache **/
  deleteAnimal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.animalService.clearCache()),
      catchError((error) => this.handleError('suppression de l’animal', error))
    );
  }

  /** Gestion centralisée des erreurs **/
  private handleError(
    action: string,
    error: HttpErrorResponse
  ): Observable<never> {
    console.error(`Erreur lors de ${action} :`, error);
    return throwError(() => new Error(`Erreur lors de ${action}.`));
  }
}
