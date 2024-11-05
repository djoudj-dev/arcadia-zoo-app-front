import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Animal } from '../../../../core/models/animal.model';

@Injectable({
  providedIn: 'root',
})
export class AnimalOverviewService {
  private imageBaseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste des animaux.
   */
  getAnimals() {
    return this.http.get<Animal[]>(`${this.imageBaseUrl}/animals`);
  }
}
