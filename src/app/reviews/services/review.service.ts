import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Review } from '../../core/models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = 'http://localhost:3000/api/reviews'; // URL du backend pour les avis

  constructor(private http: HttpClient) {}

  // Récupérer les avis validés du backend
  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}?validated=true`).pipe(
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
  addReview(review: Review): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review).pipe(
      catchError((error) => {
        console.error("Erreur lors de l'envoi de l'avis au backend", error);
        throw error;
      })
    );
  }

  // Valider un avis existant
  validateReview(id: number): Observable<Review> {
    return this.http
      .patch<Review>(`${this.apiUrl}/${id}`, { validated: true })
      .pipe(
        catchError((error) => {
          console.error("Erreur lors de la validation de l'avis :", error);
          throw error;
        })
      );
  }
}
