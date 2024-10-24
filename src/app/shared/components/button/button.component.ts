import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-button',
  template: `<button
    [type]="type"
    [ngClass]="getButtonClasses()"
    class="focus:outline-none text-white text-base font-sans w-full py-2 text-center"
    [disabled]="disabled"
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
      'bg-red-500 hover:bg-red-600 focus:bg-red-700 active:bg-red-800':
        this.color === 'red',
      'bg-primary hover:bg-primary/80 focus:bg-primary/70 active:bg-primary/90':
        this.color === 'primary',
      'bg-secondary hover:bg-secondary/80 focus:bg-secondary/70 active:bg-secondary/90':
        this.color === 'secondary',
      'bg-tertiary hover:bg-tertiary/80 focus:bg-tertiary/70 active:bg-tertiary/90':
        this.color === 'tertiary',
      'bg-quaternary hover:bg-quaternary/80 focus:bg-quaternary/70 active:bg-quaternary/90':
        this.color === 'quaternary',
      'bg-quinary hover:bg-quinary/80 focus:bg-quinary/70 active:bg-quinary/90':
        this.color === 'quinary',
      'transform hover:scale-105 focus:scale-105 transition-all duration-300 ease-in-out':
        true,
      'rounded-t-lg': !this.noRounded,
      'rounded-lg': this.rounded,
      [this.customClass]: !!this.customClass,
      'opacity-50 cursor-not-allowed': this.disabled, // Styles désactivés
    };
  }
}
