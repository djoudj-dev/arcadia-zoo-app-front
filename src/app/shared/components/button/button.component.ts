import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-button',
  template: `<button
    [type]="type"
    [ngClass]="{
      'bg-primary hover:bg-primary/80 focus:bg-primary/70': color === 'primary',
      'bg-secondary hover:bg-secondary/80 focus:bg-secondary/70':
        color === 'secondary',
      'bg-tertiary hover:bg-tertiary/80 focus:bg-tertiary/70':
        color === 'tertiary',
      'bg-quaternary hover:bg-quaternary/80 focus:bg-quaternary/70':
        color === 'quaternary',
      'bg-quinary hover:bg-quinary/80 focus:bg-quinary/70': color === 'quinary',
      'transform hover:scale-105 focus:scale-105 transition-all duration-300 ease-in-out': true,
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
  @Input() color:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'quaternary'
    | 'quinary' = 'secondary';
  @Input() noRounded: boolean = false;
  @Input() rounded: boolean = false;
}
