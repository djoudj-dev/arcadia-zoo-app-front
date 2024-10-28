import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Habitat } from '../../../core/models/habitat.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class HabitatService {
  private apiUrl = environment.apiUrl + '/api/habitats';
  private uploadsUrl = environment.apiUrl + '/uploads'; // Base URL pour les images

  constructor(private http: HttpClient) {}

  // Récupérer la liste de tous les habitats
  getHabitats(): Observable<Habitat[]> {
    return this.http.get<Habitat[]>(this.apiUrl).pipe(
      map((habitats) =>
        habitats.map((habitat) => ({
          ...habitat,
          image: `${this.uploadsUrl}/${habitat.image}`, // Ajouter l'URL complète de l'image
        }))
      )
    );
  }

  // Récupérer un habitat spécifique par son ID
  getHabitatById(id: number): Observable<Habitat | undefined> {
    return this.http.get<Habitat>(`${this.apiUrl}/${id}`).pipe(
      map((habitat) => ({
        ...habitat,
        image: `${this.uploadsUrl}/${habitat.image}`, // Ajouter l'URL complète de l'image
      }))
    );
  }
}
