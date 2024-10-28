import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Habitat } from '../../../core/models/habitat.model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HabitatManagementService {
  private apiUrl = environment.apiUrl + '/admin/habitat-management';

  constructor(private http: HttpClient) {}

  getAllHabitats(): Observable<Habitat[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Habitat[]>(this.apiUrl, { headers }).pipe(
      catchError((error) => {
        if (error.status === 403) {
          console.error('Accès interdit :', error);
        } else {
          console.error('Erreur lors de la récupération des habitats :', error);
        }
        return throwError(() => new Error(error));
      })
    );
  }

  createHabitat(formData: FormData): Observable<Habitat> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<Habitat>(this.apiUrl, formData, { headers }).pipe(
      catchError((error) => {
        if (error.status === 403) {
          console.error('Accès interdit :', error);
        } else {
          console.error("Erreur lors de la création de l'habitat :", error);
        }
        return throwError(() => new Error(error));
      })
    );
  }

  updateHabitat(id: string, formData: FormData): Observable<Habitat> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .put<Habitat>(`${this.apiUrl}/${id}`, formData, { headers })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            console.error('Accès interdit :', error);
          } else {
            console.error(
              "Erreur lors de la mise à jour de l'habitat :",
              error
            );
          }
          return throwError(() => new Error(error));
        })
      );
  }

  deleteHabitat(id: string): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError((error) => {
        if (error.status === 403) {
          console.error('Accès interdit :', error);
        } else {
          console.error("Erreur lors de la suppression de l'habitat :", error);
        }
        return throwError(() => new Error(error));
      })
    );
  }
}
