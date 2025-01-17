import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Animal } from '../../../dashboard/admin-dashboard/animal-management/model/animal.model';

@Injectable({
  providedIn: 'root',
})
export class AnimalOverviewService {
  readonly apiUrl = `${environment.apiUrl}/api/animals`;
  readonly uploadsUrl = `${environment.apiUrl}/api/uploads/animals`; // Base URL pour les images

  constructor(readonly http: HttpClient) {}

  /**
   * Récupère la liste des animaux depuis l'API.
   */
  getAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>(this.apiUrl).pipe(
      map((animals) =>
        animals.map((animal) => ({
          ...animal,
          images: animal.images ? `${this.uploadsUrl}/${animal.images}` : null,
        }))
      )
    );
  }
}
