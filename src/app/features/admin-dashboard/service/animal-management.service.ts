import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Animal } from '../../../core/models/animal.model';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AnimalManagementService {
  private apiUrl = environment.apiUrl + '/admin/animal-management';

  constructor(private http: HttpClient) {}

  // Récupérer tous les animaux
  getAllAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des animaux :', error);
        return throwError(() => new Error('Erreur de récupération.'));
      })
    );
  }

  // Créer un nouvel animal
  createAnimal(formData: FormData): Observable<Animal> {
    return this.http.post<Animal>(this.apiUrl, formData).pipe(
      catchError((error) => {
        console.error("Erreur lors de la création de l'animal :", error);
        return throwError(() => new Error('Erreur de création.'));
      })
    );
  }

  // Mettre à jour un animal existant
  updateAnimal(id: string, formData: FormData): Observable<Animal> {
    return this.http.put<Animal>(`${this.apiUrl}/${id}`, formData).pipe(
      catchError((error) => {
        console.error("Erreur lors de la mise à jour de l'animal :", error);
        return throwError(() => new Error('Erreur de mise à jour.'));
      })
    );
  }

  // Supprimer un animal
  deleteAnimal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error("Erreur lors de la suppression de l'animal :", error);
        return throwError(() => new Error('Erreur de suppression.'));
      })
    );
  }
}
