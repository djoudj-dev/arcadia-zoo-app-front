import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Service } from '../../../core/models/service.model';
import { Feature } from '../../../core/models/feature.model';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceManagementService {
  private apiUrl = `${environment.apiUrl}/admin/service-management`;
  private featuresUrl = `${environment.apiUrl}/admin/service-management/features`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste complète des services.
   * @returns {Observable<Service[]>} - Observable contenant la liste des services.
   */
  getAllServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des services :', error);
        return throwError(
          () => new Error('Erreur lors de la récupération des services')
        );
      })
    );
  }

  /**
   * Récupère la liste complète des caractéristiques.
   * @returns {Observable<Feature[]>} - Observable contenant la liste des caractéristiques.
   */
  getAllFeatures(): Observable<Feature[]> {
    return this.http.get<Feature[]>(this.featuresUrl).pipe(
      catchError((error) => {
        console.error(
          'Erreur lors de la récupération des caractéristiques :',
          error
        );
        return throwError(
          () => new Error('Erreur lors de la récupération des caractéristiques')
        );
      })
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
      catchError((error) => {
        console.error('Erreur lors de la création du service :', error);
        return throwError(
          () => new Error('Erreur lors de la création du service')
        );
      })
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
      catchError((error) => {
        console.error('Erreur lors de la mise à jour du service :', error);
        return throwError(
          () => new Error('Erreur lors de la mise à jour du service')
        );
      })
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
      catchError((error) => {
        console.error('Erreur lors de la suppression du service :', error);
        return throwError(
          () => new Error('Erreur lors de la suppression du service')
        );
      })
    );
  }
}
