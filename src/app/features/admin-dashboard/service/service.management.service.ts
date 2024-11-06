import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Service } from '../service-management/model/service.model';
import { Feature } from '../service-management/model/feature.model';

@Injectable({
  providedIn: 'root',
})
export class ServiceManagementService {
  private apiUrl = `${environment.apiUrl}/admin/service-management`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste complète des services.
   * @returns {Observable<Service[]>} - Observable contenant la liste des services.
   */
  getAllServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl).pipe(
      tap(() => console.log('Récupération des services réussie')),
      catchError(this.handleError('récupération des services'))
    );
  }

  /**
   * Récupère les features de tous les services.
   * @returns {Observable<Feature[]>} - Observable contenant les features.
   */
  getAllFeatures(): Observable<Feature[]> {
    return this.http.get<Feature[]>(`${this.apiUrl}/features`).pipe(
      tap(() => console.log('Récupération des features réussie')),
      catchError(this.handleError('récupération des features'))
    );
  }

  /**
   * Crée un nouveau service et renvoie le service créé.
   * @param formData {FormData} - Les données du service sous forme de FormData.
   * @returns {Observable<Service>} - Observable contenant le service créé.
   */
  createService(formData: FormData): Observable<Service> {
    return this.http.post<Service>(this.apiUrl, formData).pipe(
      tap((newService) =>
        console.log('Service créé avec succès :', newService)
      ),
      catchError(this.handleError('création du service'))
    );
  }

  /**
   * Met à jour un service existant et retourne le service mis à jour.
   * @param serviceId {number} - L'identifiant du service à mettre à jour.
   * @param formData {FormData} - Les nouvelles données du service sous forme de FormData.
   * @returns {Observable<Service>} - Observable contenant le service mis à jour.
   */
  updateService(serviceId: number, formData: FormData): Observable<Service> {
    return this.http.put<Service>(`${this.apiUrl}/${serviceId}`, formData).pipe(
      tap((updatedService) =>
        console.log('Service mis à jour avec succès :', updatedService)
      ),
      catchError(this.handleError('mise à jour du service'))
    );
  }

  /**
   * Supprime un service en fonction de son identifiant.
   * @param id {number} - L'identifiant du service à supprimer.
   * @returns {Observable<void>} - Observable de type void une fois le service supprimé.
   */
  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log(`Service avec l'id ${id} supprimé avec succès`)),
      catchError(this.handleError('suppression du service'))
    );
  }

  /**
   * Gestion des erreurs pour toutes les requêtes HTTP.
   * @param operation {string} - Opération où l'erreur est survenue.
   * @returns {Function} - Fonction catchError pour la gestion d'erreur.
   */
  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(`Erreur lors de la ${operation} :`, error);
      return throwError(() => new Error(`Erreur lors de la ${operation}`));
    };
  }
}
