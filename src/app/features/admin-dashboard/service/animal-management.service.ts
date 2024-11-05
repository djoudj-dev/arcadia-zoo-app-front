import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Animal } from '../../../core/models/animal.model';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { AnimalService } from '../../animal/service/animal.service';

@Injectable({
  providedIn: 'root',
})
export class AnimalManagementService {
  private apiUrl = environment.apiUrl + '/admin/animal-management';

  constructor(private http: HttpClient, private animalService: AnimalService) {}

  /**
   * Récupère la liste complète des animaux.
   * Utilise le cache du service général d'Animaux pour éviter les doublons.
   */
  getAllAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des animaux :', error);
        return throwError(
          () => new Error('Erreur lors de la récupération des animaux.')
        );
      })
    );
  }

  /**
   * Crée un nouvel animal et vide le cache pour forcer un rechargement.
   * @param formData Les données de l'animal sous forme de FormData.
   */
  createAnimal(formData: FormData): Observable<Animal> {
    return this.http.post<Animal>(this.apiUrl, formData).pipe(
      tap(() => this.animalService.clearCache()),
      catchError((error) => {
        console.error("Erreur lors de la création de l'animal :", error);
        return throwError(
          () => new Error("Erreur lors de la création de l'animal.")
        );
      })
    );
  }

  /**
   * Met à jour un animal existant et vide le cache.
   * @param id L'identifiant de l'animal à mettre à jour.
   * @param formData Les nouvelles données de l'animal sous forme de FormData.
   */
  updateAnimal(id: string, formData: FormData): Observable<Animal> {
    return this.http.put<Animal>(`${this.apiUrl}/${id}`, formData).pipe(
      tap(() => this.animalService.clearCache()),
      catchError((error) => {
        console.error("Erreur lors de la mise à jour de l'animal :", error);
        return throwError(
          () => new Error("Erreur lors de la mise à jour de l'animal.")
        );
      })
    );
  }

  /**
   * Supprime un animal existant et vide le cache.
   * @param id L'identifiant de l'animal à supprimer.
   */
  deleteAnimal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.animalService.clearCache()),
      catchError((error) => {
        console.error("Erreur lors de la suppression de l'animal :", error);
        return throwError(
          () => new Error("Erreur lors de la suppression de l'animal.")
        );
      })
    );
  }
}
