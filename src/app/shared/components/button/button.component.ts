import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-button',
  template: `<button
    [type]="type"
    [ngClass]="getButtonClasses()"
    class="focus:outline-none text-white text-base font-sans w-full py-2 text-center"
  >
    {{ text }}
  </button>`,
})
export class ButtonComponent {
  @Input() text: string = 'Button';
  @Input() type: string = 'button';
  @Input() color:
    | 'red'
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'quaternary'
    | 'quinary' = 'secondary';
  @Input() noRounded: boolean = false;
  @Input() rounded: boolean = false;
  @Input() disabled: boolean = false;
  @Input() customClass: string = '';

  // Méthode pour calculer et retourner les classes dynamiques
  getButtonClasses() {
    return {
      'bg-red-500 hover:bg-red-600 focus:bg-red-700': this.color === 'red',
      'bg-primary hover:bg-primary/80 focus:bg-primary/70':
        this.color === 'primary',
      'bg-secondary hover:bg-secondary/80 focus:bg-secondary/70':
        this.color === 'secondary',
      'bg-tertiary hover:bg-tertiary/80 focus:bg-tertiary/70':
        this.color === 'tertiary',
      'bg-quaternary hover:bg-quaternary/80 focus:bg-quaternary/70':
        this.color === 'quaternary',
      'bg-quinary hover:bg-quinary/80 focus:bg-quinary/70':
        this.color === 'quinary',
      'transform hover:scale-105 focus:scale-105 transition-all duration-300 ease-in-out':
        true,
      'rounded-t-lg': !this.noRounded,
      'rounded-lg': this.rounded,
      [this.customClass]: !!this.customClass,
    };
  }
}
