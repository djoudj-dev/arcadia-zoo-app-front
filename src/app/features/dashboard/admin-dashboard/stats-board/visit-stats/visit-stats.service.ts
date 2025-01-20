import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, map, tap } from 'rxjs';
import { ChartData, VisitStats } from './visit-stats.interface';

@Injectable({
  providedIn: 'root',
})
export class VisitStatsService {
  private readonly apiUrl = `${environment.apiUrl}/api/stats/visits`;

  constructor(private readonly http: HttpClient) {}

  getVisitStats(): Observable<ChartData> {
    console.log('Début de la récupération des statistiques de visite');
    return this.http.get<VisitStats[]>(this.apiUrl).pipe(
      tap((stats) => console.log('Données brutes reçues:', stats)),
      map((stats) => ({
        labels: stats.map((stat) => stat.category_name),
        values: stats.map((stat) => stat.visit_percentage),
        types: stats.map((stat) => stat.category_type),
      })),
      tap((chartData) =>
        console.log('Données transformées pour le graphique:', chartData)
      )
    );
  }
}
