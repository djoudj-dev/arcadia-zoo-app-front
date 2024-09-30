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
      'bg-secondary hover:bg-secondary-dark': variant === 'secondary'
    }"
    class="focus:outline-none text-white text-base font-sans w-full py-2 text-center"
  >
    {{ text }}
  </button> `,
})
export class ButtonComponent {
  @Input() text: string = 'Button';
  @Input() type: string = 'button';
  @Input() variant: 'primary' | 'secondary' | 'tertiary' = 'primary';
}
