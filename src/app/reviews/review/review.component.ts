import { Component, Input } from '@angular/core';
import { Review } from '../../core/models/review.model';
import { REVIEW } from '../../core/mocks/list-mock.component';
import { RateComponent } from '../../shared/components/rate/rate.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { DatePipe } from '@angular/common'; // Importez le service
import { ModalService } from '../modal.service';
import { AddReviewComponent } from '../add-review/add-review.component';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  standalone: true,
  imports: [RateComponent, ButtonComponent, DatePipe, AddReviewComponent],
})
export class ReviewComponent {
  @Input() stars: number[] = [1, 2, 3, 4, 5];
  @Input() rating: number = 0;
  reviews: Review[] = [];
  currentReviewIndex = 0;

  constructor(private modalService: ModalService) {} // Injectez le service

  ngOnInit() {
    this.reviews = REVIEW;
  }

  rate(star: number) {
    this.rating = star;
  }

  trackByFn(index: number) {
    return index;
  }

  previousReview(): void {
    if (this.currentReviewIndex > 0) {
      this.currentReviewIndex--;
    }
  }

  nextReview(): void {
    if (this.currentReviewIndex < this.reviews.length - 1) {
      this.currentReviewIndex++;
    }
  }

  openModal() {
    console.log('openModal');
    this.modalService.openModal();
  }
}
