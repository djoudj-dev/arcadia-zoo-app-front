import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Feature } from '../model/feature.model';
import { Service } from '../model/service.model';

/**
 * Service de gestion des services du zoo
 * Gère les opérations CRUD pour les services et leurs caractéristiques
 */
@Injectable({
  providedIn: 'root',
})
export class ServiceManagementService {
  /** URL de base pour les endpoints de gestion des services */
  private apiUrl = `${environment.apiUrl}/api/admin/service-management`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste complète des services
   * @returns Observable<Service[]> Liste des services avec leurs caractéristiques
   */
  getAllServices(): Observable<Service[]> {
    return this.http
      .get<Service[]>(this.apiUrl)
      .pipe(catchError(this.handleError('récupération des services')));
  }

  /**
   * Récupère la liste des caractéristiques disponibles
   * @returns Observable<Feature[]> Liste des caractéristiques
   */
  getAllFeatures(): Observable<Feature[]> {
    return this.http.get<Feature[]>(`${this.apiUrl}/features`).pipe(
      tap((features) => console.log('Caractéristiques récupérées:', features)),
      catchError(this.handleError('récupération des caractéristiques'))
    );
  }

  /**
   * Crée un nouveau service
   * @param formData FormData contenant les données du service et son image
   * @returns Observable<Service> Service créé
   */
  createService(formData: FormData): Observable<Service> {
    return this.http.post<Service>(this.apiUrl, formData).pipe(
      tap((newService) => console.log('Service créé avec succès:', newService)),
      catchError(this.handleError('création du service'))
    );
  }

  /**
   * Crée une nouvelle caractéristique
   * @param feature Caractéristique à créer
   * @returns Observable<Feature> Caractéristique créée
   */
  createFeature(feature: Feature): Observable<Feature> {
    return this.http.post<Feature>(`${this.apiUrl}/features`, feature).pipe(
      tap((newFeature) =>
        console.log('Caractéristique créée avec succès:', newFeature)
      ),
      catchError(this.handleError('création de la caractéristique'))
    );
  }

  /**
   * Met à jour un service existant
   * @param serviceId ID du service à mettre à jour
   * @param formData Nouvelles données du service
   * @returns Observable<Service> Service mis à jour
   */
  updateService(serviceId: number, formData: FormData): Observable<Service> {
    return this.http.put<Service>(`${this.apiUrl}/${serviceId}`, formData).pipe(
      tap((updatedService) =>
        console.log('Service mis à jour avec succès:', updatedService)
      ),
      catchError(this.handleError('mise à jour du service'))
    );
  }

  /**
   * Supprime un service
   * @param id ID du service à supprimer
   * @returns Observable<void>
   */
  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log('Service supprimé avec succès')),
      catchError(this.handleError('suppression du service'))
    );
  }

  /**
   * Efface le cache local des services
   * À implémenter si nécessaire
   */
  clearCache(): void {
    console.log('Cache des services effacé');
  }

  /**
   * Gestion centralisée des erreurs HTTP
   * @param operation Description de l'opération qui a échoué
   * @returns Fonction de traitement d'erreur
   */
  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(`Erreur lors de la ${operation}:`, error);
      return throwError(() => new Error(`Erreur lors de la ${operation}`));
    };
  }
}
