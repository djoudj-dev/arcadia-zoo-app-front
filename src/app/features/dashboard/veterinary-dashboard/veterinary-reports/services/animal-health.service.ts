import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { AnimalState } from '../model/veterinary-reports.model';

@Injectable({
  providedIn: 'root',
})
export class AnimalHealthService {
  private readonly apiUrl = `${environment.apiUrl}/api/veterinary/animal-health`;
  private readonly http = inject(HttpClient);

  updateAnimalHealth(animalId: number, state: AnimalState): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${animalId}`, { state });
  }

  getAnimalHealth(animalId: number): Observable<AnimalState> {
    return this.http.get<AnimalState>(`${this.apiUrl}/${animalId}`);
  }
}
