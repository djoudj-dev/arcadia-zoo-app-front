import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HabitatNote } from '../../../core/models/habitat-note.model';

@Injectable({
  providedIn: 'root',
})
export class HabitatNoteService {
  private apiUrl = 'https://backend-api-url.com/habitat-notes'; // URL de l'API

  constructor(private http: HttpClient) {}

  // Méthode pour soumettre un avis sur un habitat
  submitHabitatNote(note: HabitatNote): Observable<HabitatNote> {
    return this.http.post<HabitatNote>(`${this.apiUrl}/submit`, note);
  }

  // Récupérer tous les avis pour l'administrateur ou l'employé
  getAllHabitatNotes(): Observable<HabitatNote[]> {
    return this.http.get<HabitatNote[]>(`${this.apiUrl}/all`);
  }

  // Récupérer les avis d'un habitat spécifique
  getHabitatNotesByHabitatId(habitatId: number): Observable<HabitatNote[]> {
    return this.http.get<HabitatNote[]>(`${this.apiUrl}/habitat/${habitatId}`);
  }
}
