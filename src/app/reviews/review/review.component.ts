import { Component, Input } from '@angular/core';
import { Review } from '../../core/models/review.model';
import { RateComponent } from '../../shared/components/rate/rate.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ModalService } from '../modal.service';
import { AddReviewComponent } from '../add-review/add-review.component';
import { Observable } from 'rxjs';
import { ReviewService } from './review.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  standalone: true,
  imports: [
    RateComponent,
    ButtonComponent,
    DatePipe,
    AddReviewComponent,
    AsyncPipe,
  ],
})
export class ReviewComponent {
  @Input() stars: number[] = [1, 2, 3, 4, 5];
  @Input() rating: number = 0;
  reviews$: Observable<Review[]>;
  currentReviewIndex = 0;

  constructor(
    private modalService: ModalService,
    private reviewService: ReviewService
  ) {
    this.reviews$ = this.reviewService.getReviews();
  }

  previousReview(): void {
    if (this.currentReviewIndex > 0) {
      this.currentReviewIndex--;
    }
  }

  nextReview(): void {
    this.reviews$.subscribe((reviews) => {
      if (this.currentReviewIndex < reviews.length - 1) {
        this.currentReviewIndex++;
      }
    });
  }

  openModal() {
    this.modalService.openModal();
  }
}
