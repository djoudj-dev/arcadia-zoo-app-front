import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from 'app/core/auth/services/auth.service';
import { Habitat } from 'app/features/dashboard/admin-dashboard/habitat-management/model/habitat.model';
import { environment } from 'environments/environment.development';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  tap,
  throwError,
} from 'rxjs';
import { FeedingData } from '../models/feeding-data.model';
import { FeedingHistoryResponse } from '../models/feeding-history.model';

/**
 * Service gérant les opérations liées à l'alimentation des animaux
 * Utilise le pattern singleton avec providedIn: 'root'
 */
@Injectable({
  providedIn: 'root',
})
export class AnimalFeedingManagementService {
  // Injection des dépendances avec la nouvelle syntaxe
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  // Configuration des URLs
  private readonly BASE_URL = `${environment.apiUrl}/api/employe/animal-feeding-management`;

  // Gestion du cache des habitats
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly habitatsCache$ = new BehaviorSubject<Habitat[]>([]);
  private lastCacheUpdate = 0;

  /**
   * Marque un animal comme nourri avec les détails de l'alimentation
   * @param animalId - ID de l'animal
   * @param feedingData - Données d'alimentation
   */
  markAnimalAsFed(
    animalId: number,
    feedingData: FeedingData
  ): Observable<FeedingHistoryResponse> {
    // Vérifiez que les données sont valides
    if (!feedingData || !animalId) {
      console.error(
        "Les données d'alimentation ou l'ID de l'animal sont manquants."
      );
      return throwError(
        () =>
          new Error(
            "Les données d'alimentation ou l'ID de l'animal sont invalides."
          )
      );
    }

    // Enrichir les données avec des champs supplémentaires
    const enrichedData = {
      ...feedingData,
      feedingTime: new Date().toISOString(), // Format ISO pour le backend
      animalId: animalId,
    };

    // Envoyer la requête POST
    return this.http
      .post<FeedingHistoryResponse>(
        `${this.BASE_URL}/feed/${animalId}`, // Corrige l'URL
        enrichedData
      )
      .pipe(
        tap((response) => console.log('Réponse du serveur:', response)),
        catchError((error) => {
          // Gestion des erreurs
          console.error(
            "Erreur lors du marquage de l'animal comme nourri:",
            error
          );
          return throwError(
            () =>
              new Error(
                "Impossible de marquer l'animal comme nourri. Veuillez réessayer."
              )
          );
        })
      );
  }

  /**
   * Récupère l'historique des repas d'un animal avec gestion des noms d'employés
   */
  getFeedingHistory(animalId: number): Observable<FeedingHistoryResponse[]> {
    return this.http
      .get<FeedingHistoryResponse[]>(`${this.BASE_URL}/history/${animalId}`)
      .pipe(
        tap((data) => console.log("Données brutes de l'historique:", data)),
        map((data) =>
          data.map((item) => ({
            ...item,
            user_name:
              item.user_name || `Employé #${item.employe_id || item.user_id}`,
            employe_id: item.employe_id || item.user_id || 0,
          }))
        ),
        tap((data) => console.log('Données après transformation:', data))
      );
  }

  /**
   * Récupère les habitats avec leurs animaux, avec gestion de cache
   */
  getHabitatsWithAnimals(): Observable<Habitat[]> {
    if (this.isCacheValid()) {
      return this.habitatsCache$.asObservable();
    }

    return this.http
      .get<Habitat[]>(`${this.BASE_URL}/habitats-with-animals`)
      .pipe(tap((data) => this.updateCache(data)));
  }

  private isCacheValid(): boolean {
    return Date.now() - this.lastCacheUpdate < this.CACHE_DURATION;
  }

  private updateCache(data: Habitat[]): void {
    this.habitatsCache$.next(data);
    this.lastCacheUpdate = Date.now();
  }

  /**
   * Récupère tous les repas des animaux
   */
  getAllAnimalFeeding(): Observable<FeedingData[]> {
    return this.http.get<FeedingData[]>(this.BASE_URL);
  }

  /**
   * Récupère un repas d'animal par son ID
   */
  getAnimalFeedingById(id: number): Observable<FeedingData> {
    return this.http.get<FeedingData>(`${this.BASE_URL}/${id}`);
  }

  /**
   * Récupère les repas d'animal d'un employé spécifique
   */
  getAnimalFeedingByEmployeId(id: number): Observable<FeedingData[]> {
    return this.http.get<FeedingData[]>(`${this.BASE_URL}/employe/${id}`);
  }

  /**
   * Crée un nouveau repas d'animal
   */
  createAnimalFeeding(feedingData: FeedingData): Observable<FeedingData> {
    return this.http.post<FeedingData>(this.BASE_URL, feedingData);
  }

  /**
   * Met à jour un repas d'animal existant
   */
  updateAnimalFeeding(feedingData: FeedingData): Observable<FeedingData> {
    return this.http.put<FeedingData>(
      `${this.BASE_URL}/${feedingData.id}`,
      feedingData
    );
  }

  /**
   * Supprime un repas d'animal
   */
  deleteAnimalFeeding(id: number): Observable<FeedingData> {
    return this.http.post<FeedingData>(`${this.BASE_URL}/delete/${id}`, {});
  }
}
