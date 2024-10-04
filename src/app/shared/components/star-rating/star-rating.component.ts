import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [],
  styleUrl: './star-rating.component.css',
  template: `
    <div class="star-rating flex space-x-1">
      @for (star of stars; track star) {
      <svg
        (click)="rate(star)"
        [attr.class]="
          (star <= rating ? 'text-yellow-500' : 'text-gray-300') +
          ' w-8 h-8 cursor-pointer'
        "
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M10 0l2.6 6.8H20l-5 4.2 1.8 7.2-6.4-4.6-6.4 4.6 1.8-7.2-5-4.2h7.4z"
        />
      </svg>

      }
    </div>
  `,
})
export class StarRatingComponent {
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
