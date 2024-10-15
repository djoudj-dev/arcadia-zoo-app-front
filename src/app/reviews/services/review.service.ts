import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Review } from '../../core/models/review.model';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = 'https://api.example.com/reviews'; // URL du backend pour les avis

  // BehaviorSubject pour stocker les avis localement (à supprimer si localStorage n'est plus nécessaire)
  private reviewsSubject = new BehaviorSubject<Review[]>(
    this.loadInitialReviews()
  );
  reviews$: Observable<Review[]> = this.reviewsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Charger les avis existants du localStorage
  // Cette méthode peut être supprimée si le localStorage n'est plus nécessaire
  private loadInitialReviews(): Review[] {
    const storedReviews = localStorage.getItem('reviews');
    try {
      return storedReviews ? JSON.parse(storedReviews) : [];
    } catch (error) {
      console.error('Erreur lors de la lecture des avis existants :', error);
      return [];
    }
  }

  // Récupérer les avis validés du backend (et fusionner avec ceux en attente dans localStorage)
  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}?validated=true`).pipe(
      map((backendReviews: Review[]) => {
        const localReviews = this.reviewsSubject.value; // Chargement local
        const pendingReviews = localReviews.filter(
          (review) => !review.validated
        ); // Filtrer les avis non validés

        // Fusionner les avis validés du backend et les avis locaux en attente
        // Cette fusion peut être supprimée si les avis locaux ne sont plus nécessaires
        return [...backendReviews, ...pendingReviews];
      }),
      catchError((error) => {
        console.error(
          'Erreur lors de la récupération des avis du backend :',
          error
        );

        // Si le localStorage n'est plus nécessaire, ce fallback vers les avis locaux peut être supprimé
        return this.reviews$;
      })
    );
  }

  // Ajouter un avis et l'envoyer au backend
  addReview(review: Review) {
    const currentReviews = this.reviewsSubject.value;
    const updatedReviews = [...currentReviews, review];

    // Mise à jour du BehaviorSubject localement (supprimable si localStorage n'est plus nécessaire)
    this.reviewsSubject.next(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews)); // Supprimable si localStorage n'est plus nécessaire

    // Envoyer l'avis au backend
    this.http.post<Review>(this.apiUrl, review).subscribe(
      (response) => {
        console.log('Avis envoyé avec succès au backend', response);
      },
      (error) => {
        console.error("Erreur lors de l'envoi de l'avis au backend", error);
      }
    );
  }

  // Optionnel : Méthode pour valider un avis côté employé
  validateReview(id: number): Observable<Review> {
    return this.http.patch<Review>(`${this.apiUrl}/${id}`, { validated: true });
  }
}
