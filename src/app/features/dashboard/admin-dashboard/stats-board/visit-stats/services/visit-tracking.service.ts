// src/app/features/dashboard/admin-dashboard/stats-board/visit-stats/services/visit-tracking.service.ts

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AnimalService } from 'app/features/animal/service/animal.service';
import { HabitatService } from 'app/features/habitats/service/habitat.service';
import { ServiceService } from 'app/features/zoo-services/service/service.service';
import { environment } from 'environments/environment';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { Animal } from '../../../animal-management/model/animal.model';
import { Habitat } from '../../../habitat-management/model/habitat.model';
import { Service } from '../../../service-management/model/service.model';
import {
  CategoryType,
  VisitResponse,
  VisitStats,
  VisitStatsResponse,
  VisitTrackingData,
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
  private readonly activeVisits = new Map<string, Visit>();
  private readonly animalService = inject(AnimalService);
  private readonly habitatService = inject(HabitatService);
  private readonly serviceService = inject(ServiceService);

  constructor(private readonly http: HttpClient) {
    // Charger les données initiales depuis les services existants
    this.loadInitialStats();
  }

  private loadInitialStats(): void {
    // Charger les données depuis les services existants
    forkJoin({
      animals: this.animalService.getAnimals(),
      habitats: this.habitatService.getHabitats(),
      services: this.serviceService.getServices(),
    }).subscribe({
      next: ({ animals, habitats, services }) => {
        const stats: VisitStats[] = [
          ...animals.map((animal: Animal) => ({
            category_name: animal.name,
            category_type: 'animal' as const,
            visit_count: 0,
            visit_percentage: 0,
            total_duration: 0,
            average_duration: 0,
            last_visit: new Date(),
          })),
          ...habitats.map((habitat: Habitat) => ({
            category_name: habitat.name,
            category_type: 'habitat' as const,
            visit_count: 0,
            visit_percentage: 0,
            total_duration: 0,
            average_duration: 0,
            last_visit: new Date(),
          })),
          ...services.map((service: Service) => ({
            category_name: service.name,
            category_type: 'service' as const,
            visit_count: 0,
            visit_percentage: 0,
            total_duration: 0,
            average_duration: 0,
            last_visit: new Date(),
          })),
        ];

        console.log('Stats initiales générées:', stats);
        this._visitStats.next(stats);
      },
      error: (error) =>
        console.error(
          'Erreur lors du chargement des données initiales:',
          error
        ),
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
    return this.http.post<VisitResponse>(`${this.apiUrl}/track`, visit);
  }

  refreshStats(): void {
    // Essayer d'abord de charger depuis l'API
    this.http.get<VisitStats[]>(`${this.apiUrl}/stats`).subscribe({
      next: (stats) => {
        if (stats && stats.length > 0) {
          console.log('Statistiques chargées depuis la base:', stats);
          this._visitStats.next(stats);
        } else {
          // Si pas de données, recharger les stats initiales
          this.loadInitialStats();
        }
      },
      error: () => {
        // En cas d'erreur, charger les stats initiales
        this.loadInitialStats();
      },
    });
  }

  getAllStats(): Observable<VisitStats[]> {
    return this.http.get<VisitStats[]>(`${this.apiUrl}/stats`);
  }

  getStatsByCategory(categoryType: CategoryType): Observable<VisitStats[]> {
    return this.http.get<VisitStats[]>(
      `${this.apiUrl}/stats/category/${categoryType}`
    );
  }

  getStatsByDateRange(
    startDate: Date,
    endDate: Date
  ): Observable<VisitStats[]> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http.get<VisitStats[]>(`${this.apiUrl}/stats/range`, {
      params,
    });
  }

  trackVisit(data: VisitTrackingData): Observable<VisitStatsResponse> {
    return this.http.post<VisitStatsResponse>(`${this.apiUrl}/track`, data);
  }
}
