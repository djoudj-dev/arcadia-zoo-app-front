import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from 'environments/environment.development';
import { catchError, EMPTY, Observable, of, tap, throwError } from 'rxjs';
import {
  OpeningHours,
  OpeningHoursFormData,
  OpeningHoursUpdatePayload,
  ParkStatus,
} from '../models/opening-hours.model';

@Injectable({
  providedIn: 'root',
})
export class OpeningHoursService {
  private apiUrl = `${environment.apiUrl}/api/opening-hours`;
  public readonly openingHours = signal<OpeningHours[]>([]);
  public readonly parkStatus = signal<ParkStatus>({
    isOpen: true,
    message: '',
  });

  constructor(private http: HttpClient) {
    this.loadOpeningHours();
  }

  private loadOpeningHours(): void {
    this.getCurrentOpeningHours()
      .pipe(
        catchError((error) => {
          console.error('Erreur lors du chargement des horaires:', error);
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
        return throwError(() => error);
      })
    );
  }

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
      statusMessage: data.statusMessage || '',
    };

    return this.http.put<OpeningHours>(`${this.apiUrl}/${id}`, payload).pipe(
      tap((response) => {
        this.openingHours.set([response]);
      }),
      catchError((error) => this.handleError('mise à jour des horaires', error))
    );
  }

  private handleError(
    action: string,
    error: HttpErrorResponse
  ): Observable<never> {
    console.error(`Erreur lors de ${action}:`, error);
    return throwError(() => new Error(`Erreur lors de ${action}`));
  }

  /**
   * Met à jour le statut du parc
   */
  updateParkStatus(status: ParkStatus): Observable<ParkStatus> {
    if (status.isOpen === undefined) {
      return throwError(() => new Error('Le statut isOpen est requis'));
    }

    return this.http.put<ParkStatus>(`${this.apiUrl}/status`, status).pipe(
      tap((updatedStatus) => {
        this.parkStatus.set(updatedStatus);
      }),
      catchError((error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
        return throwError(() => error);
      })
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

    // Trouve les horaires correspondant au jour actuel
    const schedule = this.openingHours()[0]?.openingHours.find((h) => {
      if (currentDay >= 1 && currentDay <= 5) {
        return h.days.includes('Lundi - Vendredi');
      } else {
        return h.days.includes('Samedi - Dimanche');
      }
    });

    if (!schedule || !schedule.isOpen) return false;

    // Convertit les heures d'ouverture en format numérique (ex: 9h00 -> 900)
    const [openHour, closeHour] = schedule.hours
      .split(' - ')
      .map((time) => parseInt(time.replace('h', '')));

    return currentTime >= openHour * 100 && currentTime <= closeHour * 100;
  }

  async getOpeningHoursId(): Promise<string> {
    const currentHours = this.openingHours();
    if (currentHours && currentHours.length > 0 && currentHours[0]._id) {
      return currentHours[0]._id;
    }
    throw new Error('Aucun ID trouvé pour les horaires');
  }
}
