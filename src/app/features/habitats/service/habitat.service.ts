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
  /**
   * URL de base de l'API pour les habitats.
   * Utilisée pour toutes les requêtes liées aux habitats dans le backend.
   */
  private apiUrl = `${environment.apiUrl}/api/habitats`;

  /**
   * Cache pour stocker la liste des habitats localement.
   * Permet de limiter les requêtes HTTP répétées en stockant les résultats de la première requête.
   */
  private habitatsCache = signal<Habitat[]>([]);

  /**
   * Constructeur de la classe HabitatService.
   * @param http - Service Angular HttpClient pour effectuer des requêtes HTTP.
   */
  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste de tous les habitats.
   * Si le cache contient déjà des données, il renvoie celles-ci. Sinon, il fait une requête HTTP.
   * Les URLs d'images sont formatées pour être complètes.
   *
   * @returns Observable<Habitat[]> Observable contenant la liste des habitats.
   */
  getHabitats(): Observable<Habitat[]> {
    const cachedHabitats = this.habitatsCache();
    if (cachedHabitats.length > 0) {
      // Retourne les habitats depuis le cache
      return of(cachedHabitats);
    } else {
      // Fait une requête HTTP pour obtenir les habitats depuis le serveur
      return this.http.get<Habitat[]>(this.apiUrl).pipe(
        map((habitats) =>
          habitats.map((habitat) => ({
            ...habitat,
            images: this.formatImageUrl(habitat.images),
          }))
        ),
        tap((habitats) => this.habitatsCache.set(habitats)) // Met à jour le cache après la requête
      );
    }
  }

  /**
   * Récupère un habitat spécifique en fonction de son ID.
   * Cherche l'habitat dans le cache si disponible, ou fait une requête HTTP si nécessaire.
   *
   * @param id - L'identifiant unique de l'habitat à récupérer.
   * @returns Observable<Habitat | undefined> Observable de l'habitat, ou undefined s'il n'est pas trouvé.
   */
  getHabitatById(id: number): Observable<Habitat | undefined> {
    return this.getHabitats().pipe(
      map((habitats) => habitats.find((habitat) => habitat.id_habitat === id))
    );
  }

  /**
   * Récupère la liste des animaux associés à un habitat spécifique.
   * Fait une requête HTTP pour obtenir les animaux d'un habitat donné par son ID.
   *
   * @param habitatId - L'identifiant de l'habitat pour lequel récupérer les animaux.
   * @returns Observable<Animal[]> Observable contenant la liste des animaux.
   */
  getAnimalsByHabitatId(habitatId: number): Observable<Animal[]> {
    return this.http.get<Animal[]>(`${this.apiUrl}/${habitatId}/animals`);
  }

  /**
   * Vide le cache des habitats pour forcer un rechargement depuis l'API.
   * Utilisé après des opérations de création, modification ou suppression d'un habitat.
   */
  clearCache(): void {
    this.habitatsCache.set([]);
  }

  /**
   * Formate l'URL de l'image en ajoutant l'URL de base si l'URL n'est pas absolue.
   * Vérifie si l'URL commence par 'http', sinon préfixe avec `environment.apiUrl`.
   *
   * @param imagePath - Le chemin de l'image à formater.
   * @returns string L'URL complète de l'image.
   */
  private formatImageUrl(imagePath: string): string {
    return imagePath.startsWith('http')
      ? imagePath
      : `${environment.apiUrl}/${imagePath}`;
  }
}
