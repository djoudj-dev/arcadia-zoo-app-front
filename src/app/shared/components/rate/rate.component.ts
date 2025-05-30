import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-rate',
  standalone: true,
  template: `
    <div class="star-rating">
      @for (star of stars(); track star) {
      <span
        [class.read-only]="isReadOnly()"
        (click)="!isReadOnly() && changeRate(star)"
      >
        <i class="star" [class.filled]="star <= rating()">★</i>
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
      .read-only {
        cursor: default;
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
  @Input() rating = signal<number>(0);
  @Input() stars = signal<readonly number[]>([1, 2, 3, 4, 5]);
  @Input() isReadOnly = signal<boolean>(false);
  @Output() ratingChange: EventEmitter<number> = new EventEmitter<number>();

  onChange: (rating: number) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: number): void {
    if (value !== undefined) {
      this.rating.set(value);
    }
  }

  registerOnChange(fn: (rating: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  changeRate(newRate: number): void {
    if (!this.isReadOnly()) {
      // Vérifie si le composant est modifiable
      this.rating.set(newRate);
      this.onChange(this.rating());
      this.ratingChange.emit(this.rating());
      this.onTouched();
    }
  }
}
