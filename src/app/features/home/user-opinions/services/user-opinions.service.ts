import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserOpinions } from '../models/user-opinions.model';

@Injectable({
  providedIn: 'root',
})
export class UserOpinionsService {
  private apiUrl = `${environment.apiUrl}/api/user-opinions`;

  constructor(private http: HttpClient) {}

  // Récupérer les avis validés du backend
  getUserOpinions(): Observable<UserOpinions[]> {
    return this.http.get<UserOpinions[]>(`${this.apiUrl}?validated=true`).pipe(
      catchError((error) => {
        console.error(
          'Erreur lors de la récupération des avis du backend :',
          error
        );
        throw error;
      })
    );
  }

  // Ajouter un avis et l'envoyer au backend
  addUserOpinions(userOpinions: UserOpinions): Observable<UserOpinions> {
    console.log('Opinion à envoyer:', userOpinions);
    return this.http.post<UserOpinions>(this.apiUrl, userOpinions).pipe(
      catchError((error) => {
        console.error("Erreur lors de l'envoi de l'avis au backend", error);
        throw error;
      })
    );
  }

  // Valider un avis existant
  validateUserOpinions(id: number): Observable<UserOpinions> {
    return this.http
      .patch<UserOpinions>(`${this.apiUrl}/${id}`, { validated: true })
      .pipe(
        catchError((error) => {
          console.error("Erreur lors de la validation de l'avis :", error);
          throw error;
        })
      );
  }
}
