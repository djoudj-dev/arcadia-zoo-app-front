import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Review } from '../../core/models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private reviewsSubject = new BehaviorSubject<Review[]>(
    this.loadInitialReviews()
  );
  reviews$: Observable<Review[]> = this.reviewsSubject.asObservable();

  private loadInitialReviews(): Review[] {
    const storedReviews = localStorage.getItem('reviews');
    try {
      return storedReviews ? JSON.parse(storedReviews) : [];
    } catch (error) {
      console.error('Erreur lors de la lecture des avis existants :', error);
      return [];
    }
  }

  getReviews(): Observable<Review[]> {
    return this.reviews$;
  }

  addReview(review: Review) {
    const currentReviews = this.reviewsSubject.value;
    const updatedReviews = [...currentReviews, review];
    this.reviewsSubject.next(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
  }
}
