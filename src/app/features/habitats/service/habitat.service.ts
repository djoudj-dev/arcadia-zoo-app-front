import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Habitat } from '../../../core/models/habitat.model';
import { Observable, ReplaySubject } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HabitatService {
  private apiUrl = `${environment.apiUrl}/api/habitats`;
  private uploadsUrl = `${environment.apiUrl}/uploads`; // Base URL pour les images
  private habitatsCache$ = new ReplaySubject<Habitat[]>(1); // Cache pour optimiser les requêtes répétées
  private cacheLoaded = false; // Drapeau pour indiquer si le cache est chargé

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste de tous les habitats.
   * Utilise un cache pour éviter les appels réseau répétitifs.
   */
  getHabitats(): Observable<Habitat[]> {
    // Vérifie si le cache est déjà chargé
    if (!this.cacheLoaded) {
      this.http
        .get<Habitat[]>(this.apiUrl)
        .pipe(
          // Ajoute l'URL complète de l'image pour chaque habitat
          map((habitats) =>
            habitats.map((habitat) => ({
              ...habitat,
              image: `${this.uploadsUrl}/${habitat.image}`,
            }))
          ),
          shareReplay(1), // Partage les données entre tous les abonnés pour une seule requête
          tap((habitats) => {
            this.habitatsCache$.next(habitats); // Stocke dans le cache
            this.cacheLoaded = true; // Met à jour le drapeau pour indiquer que le cache est chargé
          })
        )
        .subscribe();
    }
    return this.habitatsCache$;
  }

  /**
   * Récupère un habitat spécifique par son ID, en utilisant le cache si possible.
   * @param id L'identifiant de l'habitat à récupérer.
   */
  getHabitatById(id: number): Observable<Habitat | undefined> {
    return this.getHabitats().pipe(
      map((habitats) => habitats.find((habitat) => habitat.id === id))
    );
  }

  /**
   * Vide le cache des habitats pour forcer un rechargement depuis l'API.
   * Appelé après la création, modification ou suppression d'un habitat.
   */
  clearCache(): void {
    this.habitatsCache$.next([]);
    this.cacheLoaded = false; // Réinitialise le drapeau pour indiquer que le cache doit être rechargé
  }
}
