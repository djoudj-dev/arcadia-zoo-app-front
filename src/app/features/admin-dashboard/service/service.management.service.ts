import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Service } from '../../../core/models/service.model';
import { catchError, Observable, throwError } from 'rxjs';
import { Feature } from '../../../core/models/feature.model';

@Injectable({
  providedIn: 'root',
})
export class ServiceManagementService {
  private apiUrl = environment.apiUrl + '/admin/service-management';

  constructor(private http: HttpClient) {}

  getAllServices(): Observable<Service[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Service[]>(this.apiUrl, { headers }).pipe(
      catchError((error) => {
        if (error.status === 403) {
          console.error('Accès interdit :', error);
        } else {
          console.error('Erreur lors de la récupération des services :', error);
        }
        return throwError(() => new Error(error));
      })
    );
  }

  getAllFeatures(): Observable<Feature[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Modifie ici l'URL pour pointer vers /features
    return this.http
      .get<Feature[]>(`${environment.apiUrl}/features`, { headers })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            console.error('Accès interdit :', error);
          } else {
            console.error(
              'Erreur lors de la récupération des caractéristiques :',
              error
            );
          }
          return throwError(() => new Error(error));
        })
      );
  }

  createService(formData: FormData): Observable<Service> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<Service>(this.apiUrl, formData, { headers }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la création du service:', error);
        return throwError(() => new Error(error)); // Utilisation de la factory function
      })
    );
  }

  updateService(serviceId: number, formData: FormData): Observable<Service> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .put<Service>(`${this.apiUrl}/${serviceId}`, formData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Erreur lors de la mise à jour du service:', error);
          return throwError(() => new Error(error));
        })
      );
  }

  // Supprimer un service
  deleteService(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la suppression du service:', error);
        return throwError(() => new Error(error));
      })
    );
  }
}
