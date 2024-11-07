import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Service } from 'app/features/admin-dashboard/service-management/model/service.model';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/admin/service-management`;
  private uploadsUrl = environment.apiUrl + '/uploads'; // Base URL pour les images

  constructor(private http: HttpClient) {}

  // Récupérer la liste de tous les services
  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl).pipe(
      map((services) =>
        services.map((service) => ({
          ...service,
          image: `${this.uploadsUrl}/${service.images}`, // Ajouter l'URL complète de l'image
        }))
      ),
      catchError(this.handleError)
    );
  }

  // Récupérer un service spécifique par son ID
  getServiceById(id: number): Observable<Service | undefined> {
    return this.http.get<Service>(`${this.apiUrl}/${id}`).pipe(
      map((service) => ({
        ...service,
        image: `${this.uploadsUrl}/${service.images}`, // Ajouter l'URL complète de l'image
      })),
      catchError(this.handleError)
    );
  }

  // Méthode de gestion des erreurs
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
