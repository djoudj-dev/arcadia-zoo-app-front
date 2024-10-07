import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type onChangeFn = (value: number) => void;
type onTouchedFn = () => void;

@Component({
  selector: 'app-star-rating',
  imports: [],
  template: `
    <div>
      @for (star of [1, 2, 3, 4, 5]; track $index) {
      <span (click)="changeRate($index + 1)">
        <i class="star" [class.filled]="$index < rate">?</i>
      </span>
      }
    </div>
  `,
  styles: `.star {
        color: gray;
        cursor: pointer;
      }
      .filled {
        color: gold;
      }`,
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RateComponent),
      multi: true,
    },
  ],
})
export class RateComponent implements ControlValueAccessor {
  rate = 0;

  onChange: onChangeFn = () => {};
  onTouched: onTouchedFn = () => {};

  writeValue(value: number): void {
    if (value !== undefined) {
      this.rate = value;
    }
  }

  registerOnChange(fn: onChangeFn): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: onTouchedFn): void {
    this.onTouched = fn;
  }

  changeRate(newRate: number): void {
    this.rate = newRate;
    this.onChange(this.rate);
  }
}
