import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-rate',
  standalone: true,
  template: `
    <div class="star-rating">
      <!-- Utilisation de @for avec une expression de tracking -->
      @for (star of stars; track star) {
      <span (click)="changeRate(star)">
        <i class="star" [class.filled]="star <= rating">★</i>
      </span>
      }
    </div>
  `,
  styles: [
    `
      .star {
        color: gray;
        cursor: pointer;
        font-size: 1.5rem;
      }
      .filled {
        color: gold;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RateComponent),
      multi: true,
    },
  ],
})
export class RateComponent implements ControlValueAccessor {
  @Input() rating: number = 0;
  @Input() stars: number[] = [1, 2, 3, 4, 5];
  @Output() ratingChange: EventEmitter<number> = new EventEmitter<number>();

  onChange: (rating: number) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: number): void {
    if (value !== undefined) {
      this.rating = value;
    }
  }

  registerOnChange(fn: (rating: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  changeRate(newRate: number): void {
    this.rating = newRate;
    this.onChange(this.rating);
    this.ratingChange.emit(this.rating);
    this.onTouched();
  }
}
