import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-button',
  template: `<button
    [type]="type"
    [ngClass]="{
      'bg-tertiary hover:bg-inherit': variant === 'tertiary',
      'bg-primary hover:bg-primary-dark': variant === 'primary',
      'bg-quaternary hover:bg-quaternary-dark': variant === 'quaternary',
      'rounded-t-lg': !noRounded
    }"
    class="focus:outline-none text-white text-base font-sans w-full py-2 text-center"
  >
    {{ text }}
  </button> `,
})
export class ButtonComponent {
  @Input() text: string = 'Button';
  @Input() type: string = 'button';
  @Input() variant: 'primary' | 'quaternary' | 'tertiary' = 'primary';
  @Input() noRounded: boolean = false;
}
