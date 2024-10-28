import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Animal } from '../../../core/models/animal.model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnimalManagementService {
  private apiUrl = environment.apiUrl + '/admin/animal-management';

  constructor(private http: HttpClient) {}

  getAllAnimals(): Observable<Animal[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Animal[]>(this.apiUrl, { headers }).pipe(
      catchError((error) => {
        if (error.status === 403) {
          console.error('Accès interdit :', error);
        } else {
          console.error('Erreur lors de la récupération des animaux :', error);
        }
        return throwError(() => new Error(error));
      })
    );
  }

  createAnimal(formData: FormData): Observable<Animal> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<Animal>(this.apiUrl, formData, { headers }).pipe(
      catchError((error) => {
        if (error.status === 403) {
          console.error('Accès interdit :', error);
        } else {
          console.error("Erreur lors de la création de l'animal :", error);
        }
        return throwError(() => new Error(error));
      })
    );
  }

  updateAnimal(id: string, formData: FormData): Observable<Animal> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .put<Animal>(`${this.apiUrl}/${id}`, formData, { headers })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            console.error('Accès interdit :', error);
          } else {
            console.error("Erreur lors de la mise à jour de l'animal :", error);
          }
          return throwError(() => new Error(error));
        })
      );
  }

  deleteAnimal(id: string): Observable<Animal> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete<Animal>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError((error) => {
        if (error.status === 403) {
          console.error('Accès interdit :', error);
        } else {
          console.error("Erreur lors de la suppression de l'animal :", error);
        }
        return throwError(() => new Error(error));
      })
    );
  }
}
