import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Service } from 'app/features/admin-dashboard/service-management/model/service.model';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  /** URL de base pour toutes les images **/
  private imageBaseUrl = `${environment.apiUrl}`;

  private apiUrl = `${environment.apiUrl}/api/services`; // Base URL pour les services
  private servicesCache = signal<Service[]>([]); // Cache pour les services

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les services et construit les URLs complètes des images.
   * @returns Observable<Service[]>
   */
  getServices(): Observable<Service[]> {
    const cachedServices = this.servicesCache();
    if (cachedServices.length > 0) {
      return of(cachedServices);
    }
    return this.http.get<Service[]>(this.apiUrl).pipe(
      map((services) =>
        services.map((service) => ({
          ...service,
          image: service.images
            ? `${environment.apiUrl}/uploads/services/${service.images}`
            : '',
          // Utilise une chaîne vide si `images` est `undefined`
        }))
      ),
      tap((services) => this.servicesCache.set(services))
    );
  }

  /**
   * Récupère un service par son ID et construit l'URL complète de son image.
   * @param id - ID du service
   * @returns Observable<Service | undefined>
   */
  getServiceById(id: number): Observable<Service | undefined> {
    return this.getServices().pipe(
      map((services) => services.find((service) => service.id_service === id)),
      tap((service) => {
        if (service) {
          service.images = service.images
            ? this.formatImageUrl('folderName', service.images)
            : '';
        }
      })
    );
  }

  /**
   * Formate l'URL de l'image pour un dossier spécifique (habitats, animals).
   * @param folder - Dossier de l'image (ex: 'animals' ou 'habitats')
   * @param imagePath - Chemin de l'image
   * @returns string - URL complète de l'image
   */
  private formatImageUrl(folder: string, imagePath: string): string {
    // Si l'URL de l'image commence déjà par "http" ou "https", ne rien ajouter
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }
    return `${this.imageBaseUrl}/${imagePath}`;
  }

  clearCache(): void {
    this.servicesCache.set([]);
  }
}
