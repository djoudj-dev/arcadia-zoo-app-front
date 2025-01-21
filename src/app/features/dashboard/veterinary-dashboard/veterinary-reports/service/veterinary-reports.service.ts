import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TokenService } from 'app/core/token/token.service';
import { Animal } from 'app/features/dashboard/admin-dashboard/animal-management/model/animal.model';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { EMPTY, Observable, map, of, throwError } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { VeterinaryReports } from '../model/veterinary-reports.model';

@Injectable({
  providedIn: 'root',
})
export class VeterinaryReportsService {
  private readonly apiUrl = `${environment.apiUrl}/api`;
  private readonly http = inject(HttpClient);
  private readonly animalCache = new Map<number, Animal>();
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private readonly lastCacheUpdate = new Map<number, number>();

  constructor(
    private readonly tokenService: TokenService,
    private readonly toastService: ToastService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getAllReports(
    page: number = 1,
    pageSize: number = 10
  ): Observable<{ data: VeterinaryReports[]; total: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', pageSize.toString());

    return this.http
      .get<{ data: VeterinaryReports[]; total: number }>(
        `${this.apiUrl}/veterinary/reports`,
        { params, headers: this.getHeaders() }
      )
      .pipe(
        catchError((error) => {
          console.error('Erreur lors de la récupération des rapports:', error);
          this.toastService.showError('Erreur lors du chargement des rapports');
          return throwError(() => error);
        })
      );
  }

  getReportById(id: string): Observable<VeterinaryReports> {
    const headers = this.getHeaders();
    return this.http.get<VeterinaryReports>(`${this.apiUrl}/${id}`, {
      headers,
    });
  }

  createReport(
    reportData: Partial<VeterinaryReports>
  ): Observable<VeterinaryReports> {
    return this.http.post<VeterinaryReports>(this.apiUrl, reportData);
  }

  updateReport(
    id: string,
    report: VeterinaryReports
  ): Observable<VeterinaryReports> {
    const headers = this.getHeaders();
    return this.http.put<VeterinaryReports>(`${this.apiUrl}/${id}`, report, {
      headers,
    });
  }

  deleteReport(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  fetchAnimalDetails(animalId: number): Observable<Animal> {
    const cachedAnimal = this.animalCache.get(animalId);
    const lastUpdate = this.lastCacheUpdate.get(animalId);
    const now = Date.now();

    if (cachedAnimal && lastUpdate && now - lastUpdate < this.cacheTimeout) {
      return of(cachedAnimal);
    }

    return this.http.get<Animal>(`${this.apiUrl}/animals/${animalId}`).pipe(
      tap((animal) => {
        this.animalCache.set(animalId, animal);
        this.lastCacheUpdate.set(animalId, now);
      }),
      shareReplay(1)
    );
  }

  updateReportStatus(
    id: string,
    is_processed: boolean
  ): Observable<VeterinaryReports> {
    const headers = this.getHeaders();
    return this.http.patch<VeterinaryReports>(
      `${this.apiUrl}/${id}/status`,
      { is_treated: is_processed },
      { headers }
    );
  }

  getReportsByAnimalId(animalId: number): Observable<VeterinaryReports[]> {
    return this.getAllReports().pipe(
      map((response) => {
        const reports = response.data.filter(
          (report) => report.id_animal === animalId
        );
        return reports.sort(
          (a, b) =>
            new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime()
        );
      }),
      catchError((error) => {
        console.error('Erreur lors de la récupération des rapports:', error);
        return EMPTY;
      })
    );
  }

  private formatImageUrl(imagePath: string | null): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) {
      // Éviter la duplication de l'URL de base
      return imagePath.replace(
        `${environment.apiUrl}/api/${environment.apiUrl}/api/`,
        `${environment.apiUrl}/api/`
      );
    }

    // Supprimer le préfixe 'uploads/animals' s'il existe
    const cleanPath = imagePath.replace(/^uploads\/animals\//, '');
    return `${environment.apiUrl}/api/uploads/animals/${cleanPath}`;
  }

  clearCache(animalId?: number) {
    if (animalId) {
      this.animalCache.delete(animalId);
      this.lastCacheUpdate.delete(animalId);
    } else {
      this.animalCache.clear();
      this.lastCacheUpdate.clear();
    }
  }
}
