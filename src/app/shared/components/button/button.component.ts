import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-button',
  template: `<button
    [type]="type"
    [ngClass]="{
      'bg-tertiary hover:bg-tertiary/80 focus:bg-tertiary/70 transform hover:scale-105 focus:scale-105 transition-all duration-300 ease-in-out':
        variant === 'tertiary',
      'rounded-t-lg': !noRounded,
      'rounded-lg': rounded
    }"
    class="focus:outline-none text-white text-base font-sans w-full py-2 text-center"
  >
    {{ text }}
  </button>`,
})
export class ButtonComponent {
  @Input() text: string = 'Button';
  @Input() type: string = 'button';
  @Input() variant: 'secondary' | 'quaternary' | 'tertiary' = 'secondary';
  @Input() noRounded: boolean = false;
  @Input() rounded: boolean = false;
}
