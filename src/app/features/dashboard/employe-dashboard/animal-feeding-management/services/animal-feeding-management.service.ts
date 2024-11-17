import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { Habitat } from 'app/features/dashboard/admin-dashboard/habitat-management/model/habitat.model';
import { environment } from 'environments/environment.development';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
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
    const currentUser = this.authService.currentUserSignal();

    const enrichedData = {
      ...feedingData,
      employeId: currentUser?.id ?? feedingData.employeId,
      employeName:
        feedingData.employeName ?? currentUser?.name ?? 'Employé inconnu',
      foodType: feedingData.foodType ?? 'Nourriture standard',
      feedingTime: new Date().toISOString(),
    };

    return this.http
      .post<FeedingHistoryResponse>(
        `${this.BASE_URL}/feed/${animalId}`,
        enrichedData
      )
      .pipe(
        map(this.transformFeedingResponse(feedingData)),
        tap((response) => console.log('Réponse transformée:', response))
      );
  }

  /**
   * Transforme la réponse du serveur pour uniformiser les données
   */
  private transformFeedingResponse(originalData: FeedingData) {
    return (response: FeedingHistoryResponse): FeedingHistoryResponse => ({
      ...response,
      employee_name: originalData.employeName,
      employee_id:
        response.user_id ?? response.employee_id ?? originalData.employeId,
    });
  }

  /**
   * Récupère l'historique des repas d'un animal avec gestion des noms d'employés
   */
  getFeedingHistory(animalId: number): Observable<FeedingHistoryResponse[]> {
    return this.http
      .get<FeedingHistoryResponse[]>(`${this.BASE_URL}/history/${animalId}`)
      .pipe(
        map((data) => this.enrichFeedingHistoryWithEmployeeNames(data)),
        tap((data) => console.log('Historique enrichi:', data))
      );
  }

  /**
   * Enrichit l'historique avec les noms des employés
   */
  private enrichFeedingHistoryWithEmployeeNames(
    history: FeedingHistoryResponse[]
  ): FeedingHistoryResponse[] {
    const currentUser = this.authService.currentUserSignal();

    return history.map((item) => {
      const employeeId = item.user_id ?? item.employee_id;
      return {
        ...item,
        employee_name:
          item.employee_name ??
          (currentUser?.id === employeeId
            ? currentUser.name
            : `Employé #${employeeId}`),
        employee_id: employeeId,
      };
    });
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
