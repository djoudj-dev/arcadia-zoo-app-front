import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from 'environments/environment';
import { catchError, EMPTY, Observable, of, tap, throwError } from 'rxjs';
import {
  OpeningHours,
  OpeningHoursFormData,
  OpeningHoursUpdatePayload,
  ParkStatus,
} from '../models/opening-hours.model';

/**
 * Service de gestion des horaires d'ouverture
 * Gère les horaires du parc et son statut d'ouverture
 */
@Injectable({
  providedIn: 'root',
})
export class OpeningHoursService {
  /** URL de base pour les endpoints des horaires */
  readonly apiUrl = `${environment.apiUrl}/api/opening-hours`;

  /** Signaux pour la gestion d'état réactive */
  public readonly openingHours = signal<OpeningHours[]>([]);
  public readonly parkStatus = signal<ParkStatus>({
    isOpen: true,
    message: '',
  });

  constructor(readonly http: HttpClient) {
    this.loadOpeningHours();
  }

  /**
   * Charge les horaires initiaux et met à jour les signaux
   */
  private loadOpeningHours(): void {
    this.getCurrentOpeningHours()
      .pipe(
        catchError((error) => {
          return EMPTY;
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.openingHours.set([response]);
            this.parkStatus.set({
              isOpen: response.parkStatus,
              message: response.statusMessage,
            });
          }
        },
      });
  }

  /**
   * Récupère les horaires actuels
   * @returns Observable<OpeningHours>
   */
  getCurrentOpeningHours(): Observable<OpeningHours> {
    return this.http.get<OpeningHours>(`${this.apiUrl}/current`).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return of({
            openingHours: [],
            parkStatus: true,
            statusMessage: '',
            isCurrent: true,
          } as OpeningHours);
        }
        return this.handleError('récupération des horaires actuels', error);
      })
    );
  }

  /**
   * Crée une nouvelle configuration d'horaires
   * @param data Données des nouveaux horaires
   * @returns Observable<OpeningHours>
   */
  createOpeningHours(data: OpeningHoursFormData): Observable<OpeningHours> {
    const payload: OpeningHoursUpdatePayload = {
      openingHours: [
        {
          days: 'Lundi - Vendredi',
          hours: data.weekdayHours,
          isOpen: data.isWeekdayOpen,
        },
        {
          days: 'Samedi - Dimanche',
          hours: data.weekendHours,
          isOpen: data.isWeekendOpen,
        },
      ],
      parkStatus: data.parkStatus,
      statusMessage: data.statusMessage ?? '',
    };

    return this.http.post<OpeningHours>(this.apiUrl, payload).pipe(
      catchError((error) => {
        return throwError(
          () => new Error('Erreur lors de la création des horaires.')
        );
      })
    );
  }

  /**
   * Met à jour les horaires d'ouverture
   * @param id Identifiant des horaires
   * @param data Nouvelles données horaires
   * @returns Observable<OpeningHours>
   */
  updateOpeningHours(
    id: string,
    data: OpeningHoursFormData
  ): Observable<OpeningHours> {
    const payload: OpeningHoursUpdatePayload = {
      openingHours: [
        {
          days: 'Lundi - Vendredi',
          hours: data.weekdayHours,
          isOpen: data.isWeekdayOpen,
        },
        {
          days: 'Samedi - Dimanche',
          hours: data.weekendHours,
          isOpen: data.isWeekendOpen,
        },
      ],
      parkStatus: data.parkStatus,
      statusMessage: data.statusMessage ?? '',
    };

    return this.http.put<OpeningHours>(`${this.apiUrl}/${id}`, payload).pipe(
      tap((response) => {
        this.openingHours.set([response]);
      }),
      catchError((error) => this.handleError('mise à jour des horaires', error))
    );
  }

  /**
   * Met à jour le statut du parc
   * @param status Nouveau statut du parc
   * @returns Observable<ParkStatus>
   */
  updateParkStatus(status: ParkStatus): Observable<ParkStatus> {
    if (status.isOpen === undefined) {
      return throwError(() => new Error('Le statut isOpen est requis'));
    }

    return this.http.put<ParkStatus>(`${this.apiUrl}/status`, status).pipe(
      tap((updatedStatus) => {
        this.parkStatus.set(updatedStatus);
      }),
      catchError((error) => this.handleError('mise à jour du statut', error))
    );
  }

  /**
   * Vérifie si le parc est ouvert à un moment donné
   * @returns boolean
   */
  isParkOpen(): boolean {
    if (!this.parkStatus().isOpen) return false;

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    const schedule = this.openingHours()[0]?.openingHours.find((h) => {
      if (currentDay >= 1 && currentDay <= 5) {
        return h.days.includes('Lundi - Vendredi');
      } else {
        return h.days.includes('Samedi - Dimanche');
      }
    });

    if (!schedule?.isOpen) return false;

    const [openHour, closeHour] = schedule.hours
      .split(' - ')
      .map((time) => parseInt(time.replace('h', '')));

    return currentTime >= openHour * 100 && currentTime <= closeHour * 100;
  }

  /**
   * Récupère l'ID des horaires actuels
   * @returns Promise<string>
   */
  async getOpeningHoursId(): Promise<string> {
    const currentHours = this.openingHours();
    if (currentHours && currentHours.length > 0 && currentHours[0]._id) {
      return currentHours[0]._id;
    }
    throw new Error('Aucun ID trouvé pour les horaires');
  }

  /**
   * Gestion centralisée des erreurs HTTP
   * @param action Description de l'action qui a échoué
   * @param error Erreur HTTP reçue
   * @returns Observable<never>
   */
  private handleError(
    action: string,
    error: HttpErrorResponse
  ): Observable<never> {
    return throwError(() => new Error(`Erreur lors de ${action}`));
  }
}
