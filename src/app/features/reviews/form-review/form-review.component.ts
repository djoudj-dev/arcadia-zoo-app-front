import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';

@Component({
  selector: 'app-form-review',
  standalone: true,
  imports: [FormsModule, ButtonComponent, StarRatingComponent],
  templateUrl: './form-review.component.html',
  styleUrl: './form-review.component.css',
})
export class FormReviewComponent {
  productRating: number = 3;

  @Input() rating: number = 0;
  @Input() stars: number[] = [1, 2, 3, 4, 5];
  @Output() ratingChange: EventEmitter<number> = new EventEmitter<number>();

  rate(star: number) {
    this.rating = star;
    this.ratingChange.emit(this.rating);
  }

  trackByFn(index: number) {
    return index;
  }
}
