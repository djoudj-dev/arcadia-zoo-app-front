import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment.development';
import { map, Observable, tap } from 'rxjs';
import { FeedingData } from '../models/feeding-data.model';
import { FeedingHistoryResponse } from '../models/feeding-history.model';

@Injectable({
  providedIn: 'root',
})
export class AnimalFeedingManagementService {
  private apiUrl = `${environment.apiUrl}/api/employe/animal-feeding-management`;
  private userApiUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Marque un animal comme nourri et enregistre les détails
   */
  markAnimalAsFed(
    animalId: number,
    feedingData: FeedingData
  ): Observable<FeedingHistoryResponse> {
    const currentUser = this.authService.currentUserSignal();

    // Données à envoyer
    const data = {
      ...feedingData,
      employeId: currentUser?.id || feedingData.employeId,
      employeName:
        feedingData.employeName || currentUser?.name || 'Employé inconnu',
      foodType: feedingData.foodType || 'Nourriture standard',
      feedingTime: new Date().toISOString(),
    };

    return this.http
      .post<FeedingHistoryResponse>(`${this.apiUrl}/feed/${animalId}`, data)
      .pipe(
        map((response) => ({
          ...response,
          // Conserver le nom de l'employé des données envoyées
          employee_name: data.employeName,
          employee_id:
            response.user_id || response.employee_id || data.employeId,
        })),
        tap((transformedResponse) =>
          console.log('Réponse transformée:', transformedResponse)
        )
      );
  }

  /**
   * Récupère tous les repas des animaux
   */
  getAllAnimalFeeding(): Observable<FeedingData[]> {
    return this.http.get<FeedingData[]>(this.apiUrl);
  }

  /**
   * Récupère un repas d'animal par son ID
   */
  getAnimalFeedingById(id: number): Observable<FeedingData> {
    return this.http.get<FeedingData>(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupère les repas d'animal d'un employé spécifique
   */
  getAnimalFeedingByEmployeId(id: number): Observable<FeedingData[]> {
    return this.http.get<FeedingData[]>(`${this.apiUrl}/employe/${id}`);
  }

  /**
   * Crée un nouveau repas d'animal
   */
  createAnimalFeeding(feedingData: FeedingData): Observable<FeedingData> {
    return this.http.post<FeedingData>(this.apiUrl, feedingData);
  }

  /**
   * Met à jour un repas d'animal existant
   */
  updateAnimalFeeding(feedingData: FeedingData): Observable<FeedingData> {
    return this.http.put<FeedingData>(
      `${this.apiUrl}/${feedingData.id}`,
      feedingData
    );
  }

  /**
   * Supprime un repas d'animal
   */
  deleteAnimalFeeding(id: number): Observable<FeedingData> {
    return this.http.post<FeedingData>(`${this.apiUrl}/delete/${id}`, {});
  }

  /**
   * Récupère l'historique des repas d'un animal
   */
  getFeedingHistory(animalId: number): Observable<FeedingHistoryResponse[]> {
    return this.http
      .get<FeedingHistoryResponse[]>(`${this.apiUrl}/history/${animalId}`)
      .pipe(
        map((data) =>
          data.map((item) => {
            const employeeId = item.user_id || item.employee_id;
            const currentUser = this.authService.currentUserSignal();

            return {
              ...item,
              employee_name:
                item.employee_name ||
                (currentUser?.id === employeeId
                  ? currentUser.name
                  : `Employé #${employeeId}`),
              employee_id: employeeId,
            };
          })
        ),
        tap((data) => console.log('Historique transformé:', data))
      );
  }
}
