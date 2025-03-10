import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TokenService } from 'app/core/token/token.service';
import { Animal } from 'app/features/dashboard/admin-dashboard/animal-management/model/animal.model';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { Observable, map, of } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { VeterinaryReports } from '../model/veterinary-reports.model';

@Injectable({
  providedIn: 'root',
})
export class VeterinaryReportsService {
  private readonly apiUrl = `${environment.apiUrl}/api/veterinary/reports`;
  private readonly animalApiUrl = `${environment.apiUrl}/api/animals`;
  private readonly http = inject(HttpClient);
  private readonly animalCache = new Map<number, Animal>();
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private readonly lastCacheUpdate = new Map<number, number>();

  constructor(
    private readonly tokenService: TokenService,
    private readonly toastService: ToastService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    console.log('Token récupéré:', token ? 'présent' : 'null');

    if (!token) {
      console.warn('Aucun token trouvé dans le sessionStorage');
      this.toastService.showError(
        'Votre session a expiré, veuillez vous reconnecter'
      );
      // Rediriger vers la page de connexion ou rafraîchir le token
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  private getPublicHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
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
      .get<{ data: VeterinaryReports[]; total: number }>(this.apiUrl, {
        params,
        headers: this.getPublicHeaders(),
      })
      .pipe(
        map((response) => {
          if (!response) {
            return { data: [], total: 0 };
          }
          return {
            data: response.data || [],
            total: response.total || 0,
          };
        }),
        catchError((error) => {
          console.error('Erreur lors de la récupération des rapports:', error);
          this.toastService.showError('Erreur lors du chargement des rapports');
          return of({ data: [], total: 0 });
        })
      );
  }

  getReportById(id: string): Observable<VeterinaryReports> {
    const headers = this.getPublicHeaders();
    return this.http.get<VeterinaryReports>(`${this.apiUrl}/${id}`, {
      headers,
    });
  }

  createReport(
    reportData: Partial<VeterinaryReports>
  ): Observable<VeterinaryReports> {
    return this.http.post<VeterinaryReports>(this.apiUrl, reportData, {
      headers: this.getAuthHeaders(),
    });
  }

  updateReport(
    id: string,
    report: VeterinaryReports
  ): Observable<VeterinaryReports> {
    const headers = this.getAuthHeaders();
    return this.http.put<VeterinaryReports>(`${this.apiUrl}/${id}`, report, {
      headers,
    });
  }

  deleteReport(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  fetchAnimalDetails(animalId: number): Observable<Animal> {
    const cachedAnimal = this.animalCache.get(animalId);
    const lastUpdate = this.lastCacheUpdate.get(animalId);
    const now = Date.now();

    if (cachedAnimal && lastUpdate && now - lastUpdate < this.cacheTimeout) {
      return of(cachedAnimal);
    }

    return this.http
      .get<Animal>(`${this.animalApiUrl}/${animalId}`, {
        headers: this.getPublicHeaders(),
      })
      .pipe(
        tap((animal) => {
          this.animalCache.set(animalId, animal);
          this.lastCacheUpdate.set(animalId, now);
        }),
        catchError((error) => {
          console.error("Erreur lors de la récupération de l'animal:", error);
          this.toastService.showError(
            "Impossible de récupérer les informations de l'animal"
          );
          throw error;
        }),
        shareReplay(1)
      );
  }

  updateReportStatus(
    id: string,
    is_processed: boolean
  ): Observable<VeterinaryReports> {
    const headers = this.getAuthHeaders();
    return this.http.patch<VeterinaryReports>(
      `${this.apiUrl}/${id}/status`,
      { is_treated: is_processed },
      { headers }
    );
  }

  getReportsByAnimalId(animalId: number): Observable<VeterinaryReports[]> {
    console.log(
      `Tentative de récupération des rapports pour l'animal ${animalId}`
    );

    const url = `${this.apiUrl}/animal/${animalId}`;
    console.log('URL appelée:', url);

    return this.http
      .get<VeterinaryReports[]>(url, { headers: this.getPublicHeaders() })
      .pipe(
        tap((reports) => {
          console.log(`Rapports reçus pour l'animal ${animalId}:`, reports);
        }),
        map((reports) => {
          const sortedReports = [...reports].sort(
            (a, b) =>
              new Date(b.visit_date).getTime() -
              new Date(a.visit_date).getTime()
          );
          return sortedReports;
        }),
        catchError((error) => {
          console.error(
            'Erreur lors de la récupération des rapports vétérinaires:',
            error
          );
          console.error("Détails de l'erreur:", {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            url: error.url,
            error: error.error, // Ajouter le corps de l'erreur
          });

          let errorMessage =
            'Impossible de charger les rapports vétérinaires pour cet animal';

          if (error.status === 404) {
            errorMessage = 'Aucun rapport trouvé pour cet animal';
          } else if (error.status === 401) {
            errorMessage = 'Votre session a expiré, veuillez vous reconnecter';
          }

          this.toastService.showError(errorMessage);
          return of([]);
        })
      );
  }

  private formatImageUrl(imagePath: string | null): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) {
      // Éviter la duplication de l'URL de base
      return imagePath.replace(
        `${environment.apiUrl}/api/`,
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
