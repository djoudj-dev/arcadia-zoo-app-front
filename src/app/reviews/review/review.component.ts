import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Review } from '../../core/models/review.model';
import { REVIEW } from '../../core/mocks/list-mock.component';
import { RateComponent } from '../../shared/components/rate/rate.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  standalone: true,
  imports: [DatePipe, RateComponent, ButtonComponent],
})
export class ReviewComponent {
  @Input() stars: number[] = [1, 2, 3, 4, 5];
  @Input() rating: number = 0;
  @Output() ratingChange: EventEmitter<number> = new EventEmitter<number>();
  reviews: Review[] = [];
  showModal: boolean = false;
  currentReviewIndex = 0;
  isModalOpen: boolean = false;
  productRating: number = 3;

  ngOnInit() {
    this.reviews = REVIEW;
  }

  rate(star: number) {
    this.rating = star;
    this.ratingChange.emit(this.rating);
  }

  trackByFn(index: number) {
    return index;
  }

  // Fonction pour afficher l'avis précédent
  previousReview(): void {
    if (this.currentReviewIndex > 0) {
      this.currentReviewIndex--;
    }
  }

  // Fonction pour afficher l'avis suivant
  nextReview(): void {
    if (this.currentReviewIndex < this.reviews.length - 1) {
      this.currentReviewIndex++;
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
