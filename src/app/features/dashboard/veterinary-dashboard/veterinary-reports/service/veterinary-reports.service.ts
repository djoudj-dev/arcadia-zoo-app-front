import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Animal } from 'app/features/dashboard/admin-dashboard/animal-management/model/animal.model';
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { VeterinaryReports } from '../model/veterinary-reports.model';

@Injectable({
  providedIn: 'root',
})
export class VeterinaryReportsService {
  private apiUrl = `${environment.apiUrl}/api/veterinary-reports`;
  private animalApiUrl = `${environment.apiUrl}/api/animals`;

  constructor(private http: HttpClient) {}

  getAllReports(): Observable<VeterinaryReports[]> {
    return this.http.get<VeterinaryReports[]>(this.apiUrl);
  }

  getReportById(id: string): Observable<VeterinaryReports> {
    return this.http.get<VeterinaryReports>(`${this.apiUrl}/${id}`);
  }

  createReport(report: VeterinaryReports): Observable<VeterinaryReports> {
    return this.http.post<VeterinaryReports>(this.apiUrl, report);
  }

  updateReport(
    id: string,
    report: VeterinaryReports
  ): Observable<VeterinaryReports> {
    return this.http.put<VeterinaryReports>(`${this.apiUrl}/${id}`, report);
  }

  deleteReport(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  fetchAnimalDetails(animalId: number): Observable<Animal> {
    return this.http.get<Animal>(`${this.animalApiUrl}/${animalId}`).pipe(
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
    return this.http
      .patch<VeterinaryReports>(`${this.apiUrl}/${id}/status`, {
        is_treated: is_processed,
      })
      .pipe(
        tap((response) =>
          console.log('Statut du rapport mis à jour:', response)
        ),
        catchError((error) => {
          console.error('Erreur lors de la mise à jour du statut:', error);
          throw error;
        })
      );
  }
}
