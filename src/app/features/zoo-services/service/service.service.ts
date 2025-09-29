import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Service } from 'app/features/dashboard/admin-dashboard/service-management/model/service.model';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  /** URL de base pour toutes les images **/
  private readonly imageBaseUrl = `${environment.apiUrl}/api`;

  private readonly apiUrl = `${environment.apiUrl}/api/services`; // Base URL pour les services
  private readonly servicesCache = signal<Service[]>([]); // Cache pour les services

  constructor(private readonly http: HttpClient) {}

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
          images: service.images
            ? this.formatImageUrl('services', service.images)
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
            ? this.formatImageUrl('services', service.images)
            : '';
        }
      })
    );
  }

  /**
   * Formate l'URL de l'image pour un dossier spécifique (services, habitats, animals).
   * @param folder - Dossier de l'image (ex: 'services', 'habitats', 'animals')
   * @param imagePath - Chemin de l'image
   * @returns string - URL complète de l'image
   */
  private formatImageUrl(folder: string, imagePath: string): string {
    // Si l'URL de l'image commence déjà par "http" ou "https", ne rien ajouter
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }

    // Si le chemin contient déjà "uploads", on extrait juste le nom du fichier
    if (imagePath.includes('uploads')) {
      const parts = imagePath.split('/');
      imagePath = parts[parts.length - 1];
    }

    return `${this.imageBaseUrl}/images/${folder}/${imagePath}`;
  }

  clearCache(): void {
    this.servicesCache.set([]);
  }
}
