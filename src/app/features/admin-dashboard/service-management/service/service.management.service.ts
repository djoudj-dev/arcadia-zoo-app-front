import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Feature } from '../model/feature.model';
import { Service } from '../model/service.model';

@Injectable({
  providedIn: 'root',
})
export class ServiceManagementService {
  private apiUrl = `${environment.apiUrl}/admin/service-management`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste complète des services.
   */
  getAllServices(): Observable<Service[]> {
    return this.http
      .get<Service[]>(this.apiUrl)
      .pipe(catchError(this.handleError('récupération des services')));
  }
  /**
   * Récupère la liste complète des services.
   */
  getAllFeatures(): Observable<Feature[]> {
    return this.http.get<Feature[]>(`${this.apiUrl}/features`).pipe(
      catchError((error) => {
        console.error(
          'Erreur lors de la récupération des caractéristiques:',
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
      tap(() => this.clearCache()), // Invalider le cache local
      catchError(this.handleError('création du service'))
    );
  }

  /**
   * Crée une nouvelle feature et renvoie la feature créée.
   * @param feature {Feature} - La feature à créer.
   * @returns {Observable<Feature>} - Observable contenant la feature créée.
   */
  createFeature(feature: Feature): Observable<Feature> {
    return this.http.post<Feature>(`${this.apiUrl}/features`, feature).pipe(
      tap((newFeature) =>
        console.log('Caractéristique créée avec succès :', newFeature)
      ),
      catchError(this.handleError('création de la caractéristique'))
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
      tap(() => this.clearCache()), // Invalider le cache local après suppression
      catchError(this.handleError('suppression du service'))
    );
  }

  /**
   * Efface le cache local des services.
   */
  clearCache(): void {
    // Implémentez la logique de cache ici, si nécessaire
    console.log('Cache des services effacé');
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
