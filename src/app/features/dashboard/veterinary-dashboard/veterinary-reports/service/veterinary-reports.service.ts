import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TokenService } from 'app/core/token/token.service';
import { Animal } from 'app/features/dashboard/admin-dashboard/animal-management/model/animal.model';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { VeterinaryReports } from '../model/veterinary-reports.model';

@Injectable({
  providedIn: 'root',
})
export class VeterinaryReportsService {
  private readonly apiUrl = `${environment.apiUrl}/api/veterinary/reports`;
  private readonly animalApiUrl = `${environment.apiUrl}/api/animals`;
  private readonly http = inject(HttpClient);

  constructor(private readonly tokenService: TokenService) {}

  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getAllReports(): Observable<VeterinaryReports[]> {
    const headers = this.getHeaders();
    return this.http.get<VeterinaryReports[]>(this.apiUrl, { headers }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des rapports:', error);
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
    const headers = this.getHeaders();
    return this.http
      .get<Animal>(`${this.animalApiUrl}/${animalId}`, { headers })
      .pipe(
        map((animal) => ({
          ...animal,
          images: this.formatImageUrl(animal.images),
        }))
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
    return this.http.get<VeterinaryReports[]>(
      `${this.apiUrl}/animal/${animalId}`
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
}
