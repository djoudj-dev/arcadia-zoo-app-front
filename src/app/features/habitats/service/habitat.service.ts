import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Habitat } from '../../../core/models/habitat.model';
import { map, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Animal } from '../../../core/models/animal.model';

@Injectable({
  providedIn: 'root',
})
export class HabitatService {
  private apiUrl = `${environment.apiUrl}/api/habitats`;
  private uploadsUrl = `${environment.apiUrl}/uploads`; // Base URL pour les images

  // Utilisation d'un signal pour gérer le cache des habitats
  private habitatsCache = signal<Habitat[]>([]); // Initialise le signal avec un tableau vide

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste de tous les habitats.
   * Si le cache est vide, effectue une requête HTTP, sinon renvoie les données du cache.
   *
   * @returns Observable<Habitat[]> Observable de la liste des habitats.
   */
  getHabitats(): Observable<Habitat[]> {
    if (this.habitatsCache().length > 0) {
      // Renvoie les données du cache en tant qu'observable
      return of(this.habitatsCache());
    } else {
      // Charge les données depuis l'API et met à jour le cache
      return this.http.get<Habitat[]>(this.apiUrl).pipe(
        map((habitats) =>
          habitats.map((habitat) => ({
            ...habitat,
            image: `${this.uploadsUrl}/${habitat.image}`, // Ajoute l'URL complète de l'image
          }))
        ),
        tap((habitats) => this.habitatsCache.set(habitats)) // Met à jour le cache avec les données de l'API
      );
    }
  }

  /**
   * Récupère un habitat spécifique par son ID, utilise le cache si possible.
   *
   * @param id L'identifiant de l'habitat à récupérer.
   * @returns Observable<Habitat | undefined> Observable de l'habitat ou undefined s'il n'est pas trouvé.
   */
  getHabitatById(id: number): Observable<Habitat | undefined> {
    return this.getHabitats().pipe(
      map((habitats) => habitats.find((habitat) => habitat.id === id))
    );
  }

  /**
   * Récupère la liste des animaux liés à un habitat spécifique.
   * @param habitatId L'identifiant de l'habitat pour lequel récupérer les animaux.
   */
  getAnimalsByHabitatId(habitatId: number): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.apiUrl}/${habitatId}/animals`);
  }

  /**
   * Vide le cache des habitats pour forcer un rechargement depuis l'API.
   * Appelé après la création, modification ou suppression d'un habitat.
   */
  clearCache(): void {
    this.habitatsCache.set([]); // Réinitialise le cache
  }
}
