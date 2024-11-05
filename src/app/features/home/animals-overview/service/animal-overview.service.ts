import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Animal } from '../../../admin-dashboard/animal-management/model/animal.model';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AnimalOverviewService {
  private apiUrl = `${environment.apiUrl}/api/animals`;
  private uploadsUrl = `${environment.apiUrl}`; // Base URL pour les images

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste des animaux depuis l'API.
   */
  getAnimals(): Observable<Animal[]> {
    console.log('Fetching animals from:', this.apiUrl); // Ajoutez cette ligne pour vérifier l'URL
    return this.http.get<Animal[]>(this.apiUrl).pipe(
      map((animals) =>
        animals.map((animal) => ({
          ...animal,
          images: animal.images ? `${this.uploadsUrl}/${animal.images}` : '', // Ajouter l'URL complète de l'image
        }))
      ),
      tap((animals) => console.log('Fetched animals:', animals)), // Ajoutez cette ligne pour vérifier les données reçues
      catchError((error) => {
        console.error('Error fetching animals:', error);
        return throwError(error);
      })
    );
  }
}
