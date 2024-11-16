import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

/**
 * Composant Button réutilisable et personnalisable
 * Permet de créer des boutons avec différentes variantes de couleurs et styles
 * Ce composant est autonome (standalone) et utilise CommonModule
 */
@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-button',
  template: ` <button
    [type]="type"
    [ngClass]="getButtonClasses()"
    class="focus:outline-none text-white text-base font-sans w-full py-2 text-center"
    [disabled]="disabled"
  >
    <ng-content />
    {{ text }}
  </button>`,
})
export class ButtonComponent {
  /**
   * Propriétés de configuration du bouton :
   * @param text - Texte à afficher dans le bouton (défaut: 'Button')
   * @param type - Type HTML du bouton (défaut: 'button')
   * @param color - Variante de couleur du bouton
   *               Options: 'red', 'primary', 'secondary', 'tertiary',
   *                       'quaternary', 'quinary', 'success', 'danger'
   *               (défaut: 'secondary')
   * @param noRounded - Désactive l'arrondi des coins si true (défaut: false)
   * @param rounded - Active l'arrondi complet des coins si true (défaut: false)
   * @param disabled - Désactive le bouton si true (défaut: false)
   * @param customClass - Classes CSS additionnelles à appliquer (défaut: '')
   */
  @Input() text: string = 'Button';
  @Input() type: string = 'button';
  @Input() color:
    | 'red'
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'quaternary'
    | 'quinary'
    | 'success'
    | 'danger' = 'secondary';
  @Input() noRounded: boolean = false;
  @Input() rounded: boolean = false;
  @Input() disabled: boolean = false;
  @Input() customClass: string = '';

  /**
   * Calcule et retourne les classes CSS dynamiques du bouton
   * Gère les couleurs, les états (hover, focus, active), les arrondis et l'état désactivé
   * @returns Un objet contenant les classes CSS à appliquer
   */
  getButtonClasses() {
    return {
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
      'bg-green-500 hover:bg-green-600 focus:bg-green-700 active:bg-green-800':
        this.color === 'success',
      'bg-red-500 hover:bg-red-600 focus:bg-red-700 active:bg-red-800':
        this.color === 'danger' || this.color === 'red',
      'transform hover:scale-105 focus:scale-105 transition-all duration-300 ease-in-out':
        true,
      'rounded-t-lg': !this.noRounded,
      'rounded-lg': this.rounded,
      [this.customClass]: !!this.customClass,
      'opacity-50 cursor-not-allowed': this.disabled,
    };
  }
}
