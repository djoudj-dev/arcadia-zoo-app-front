// src/app/features/dashboard/admin-dashboard/stats-board/visit-stats/services/visit-tracking.service.ts

import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TokenService } from 'app/core/token/token.service';
import { AnimalService } from 'app/features/animal/service/animal.service';
import { HabitatService } from 'app/features/habitats/service/habitat.service';
import { ServiceService } from 'app/features/zoo-services/service/service.service';
import { environment } from 'environments/environment';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  switchMap,
} from 'rxjs';
import {
  CategoryType,
  VisitResponse,
  VisitStats,
  VisitTrackingData,
  VisitTrackingResponse,
} from '../interfaces/visit-stats.interface';

export interface Visit {
  categoryName: string;
  categoryType: CategoryType;
  pageId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class VisitTrackingService {
  private readonly apiUrl = `${environment.apiUrl}/api/visits`;
  private readonly _visitStats = new BehaviorSubject<VisitStats[]>([]);
  readonly visitStats$ = this._visitStats.asObservable();
  private readonly http = inject(HttpClient);
  private readonly animalService = inject(AnimalService);
  private readonly habitatService = inject(HabitatService);
  private readonly serviceService = inject(ServiceService);
  private readonly tokenService = inject(TokenService);
  private readonly activeVisits = new Map<string, Visit>();

  constructor() {
    this.loadStats();
  }

  loadStats(): void {
    this.getAllStats().subscribe({
      next: (stats) => {
        if (stats && Array.isArray(stats)) {
          if (stats.length > 0) {
            this._visitStats.next(stats);
          } else {
            this.initializeEmptyStats();
          }
        } else {
          this.initializeEmptyStats();
        }
      },
    });
  }

  // Alias pour la compatibilité avec le code existant
  refreshStats = this.loadStats;

  private initializeEmptyStats(): void {
    this.animalService
      .getAnimals()
      .pipe(
        switchMap((animals) => {
          const animalStats = animals.map((animal) => ({
            category_name: animal.name,
            category_type: 'animal',
            visit_count: 0,
            visit_percentage: 0,
            total_duration: 0,
            average_duration: 0,
            last_visit: new Date(),
          }));

          return this.habitatService.getHabitats().pipe(
            map((habitats) => ({
              animals: animalStats,
              habitats: habitats.map((habitat) => ({
                category_name: habitat.name,
                category_type: 'habitat',
                visit_count: 0,
                visit_percentage: 0,
                total_duration: 0,
                average_duration: 0,
                last_visit: new Date(),
              })),
            }))
          );
        }),
        switchMap(({ animals, habitats }) =>
          this.serviceService.getServices().pipe(
            map((services) => ({
              animals,
              habitats,
              services: services.map((service) => ({
                category_name: service.name,
                category_type: 'service',
                visit_count: 0,
                visit_percentage: 0,
                total_duration: 0,
                average_duration: 0,
                last_visit: new Date(),
              })),
            }))
          )
        )
      )
      .subscribe({
        next: ({ animals, habitats, services }) => {
          console.log('Données récupérées pour initialisation:', {
            animalsCount: animals.length,
            habitatsCount: habitats.length,
            servicesCount: services.length,
          });

          const stats: VisitStats[] = [...animals, ...habitats, ...services];

          console.log('Statistiques initialisées:', stats);
          this._visitStats.next(stats);
        },
        error: (error) => {
          console.error(
            "Erreur lors de l'initialisation des statistiques:",
            error
          );
          this._visitStats.next([]);
        },
      });
  }

  startTracking(
    categoryName: string,
    categoryType: CategoryType,
    pageId: string
  ): void {
    const visit: Visit = {
      categoryName,
      categoryType,
      pageId,
      startTime: new Date(),
    };
    this.activeVisits.set(pageId, visit);
    console.log(`Début du tracking pour ${categoryType} ${categoryName}`);
  }

  stopTracking(pageId: string): void {
    const visit = this.activeVisits.get(pageId);
    if (visit) {
      visit.endTime = new Date();
      visit.duration = visit.endTime.getTime() - visit.startTime.getTime();
      this.saveVisit(visit).subscribe({
        next: () => {
          console.log(
            `Visite enregistrée pour ${visit.categoryType} ${visit.categoryName}`
          );
          this.refreshStats();
        },
        error: (error) =>
          console.error("Erreur lors de l'enregistrement de la visite:", error),
      });
      this.activeVisits.delete(pageId);
    }
  }

  private saveVisit(visit: Visit): Observable<VisitResponse> {
    return this.http.post<VisitResponse>(`${this.apiUrl}/track`, visit, {
      headers: this.getHeaders(),
    });
  }

  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  private handleError<T>(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of([] as unknown as T);
    };
  }

  getAllStats(): Observable<VisitStats[]> {
    return this.http
      .get<VisitStats[]>(`${this.apiUrl}/stats`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Erreur lors de la récupération des stats:', error);
          return of([]);
        })
      );
  }

  getStatsByCategory(categoryType: CategoryType): Observable<VisitStats[]> {
    return this.http
      .get<VisitStats[]>(`${this.apiUrl}/stats/category/${categoryType}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error(
            'Erreur lors de la récupération des stats par catégorie:',
            error
          );
          return of([]);
        })
      );
  }

  getStatsByDateRange(
    startDate: Date,
    endDate: Date
  ): Observable<VisitStats[]> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http
      .get<VisitStats[]>(`${this.apiUrl}/stats/range`, {
        params,
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error(
            'Erreur lors de la récupération des stats par date:',
            error
          );
          return of([]);
        })
      );
  }

  trackVisit(data: VisitTrackingData): Observable<VisitTrackingResponse> {
    return this.http
      .post<VisitTrackingResponse>(`${this.apiUrl}/track`, data, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Erreur lors du tracking de la visite:', error);
          return of({ success: false, message: 'Une erreur est survenue' });
        })
      );
  }
}
