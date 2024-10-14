import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Review } from '../../core/models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private reviewsSubject = new BehaviorSubject<Review[]>([]);
  reviews$: Observable<Review[]> = this.reviewsSubject.asObservable();

  getReviews(): Observable<Review[]> {
    return this.reviews$;
  }

  addReview(review: Review) {
    const currentReviews = this.reviewsSubject.value;
    this.reviewsSubject.next([...currentReviews, review]);
  }
}
