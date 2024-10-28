import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Service } from '../../../core/models/service.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private apiUrl = environment.apiUrl + '/services';
  private uploadsUrl = environment.apiUrl + '/uploads'; // Base URL pour les images

  constructor(private http: HttpClient) {}

  // Récupérer la liste de tous les services
  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl).pipe(
      map((services) =>
        services.map((service) => ({
          ...service,
          image: `${this.uploadsUrl}/${service.image}`, // Ajouter l'URL complète de l'image
        }))
      )
    );
  }

  // Récupérer un service spécifique par son ID
  getServiceById(id: number): Observable<Service | undefined> {
    return this.http.get<Service>(`${this.apiUrl}/${id}`).pipe(
      map((service) => ({
        ...service,
        image: `${this.uploadsUrl}/${service.image}`, // Ajouter l'URL complète de l'image
      }))
    );
  }
}
