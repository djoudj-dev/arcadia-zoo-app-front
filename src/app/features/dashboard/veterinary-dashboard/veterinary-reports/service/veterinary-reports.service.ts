import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

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

  createReport(report: VeterinaryReports): Observable<VeterinaryReports> {
    const headers = this.getHeaders();
    return this.http.post<VeterinaryReports>(this.apiUrl, report, { headers });
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
          images: animal.images
            ? `${environment.apiUrl}/api/${animal.images}`
            : '',
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
}
