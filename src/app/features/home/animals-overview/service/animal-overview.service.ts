import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Animal } from '../../../admin-dashboard/animal-management/model/animal.model';

@Injectable({
  providedIn: 'root',
})
export class AnimalOverviewService {
  private apiUrl = `${environment.apiUrl}/api/animals`;
  private uploadsUrl = `${environment.apiUrl}/api`; // Base URL pour les images

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste des animaux depuis l'API.
   */
  getAnimals(): Observable<Animal[]> {
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
        return of([]); // Retourne un Observable vide en cas d'erreur
      })
    );
  }
}
