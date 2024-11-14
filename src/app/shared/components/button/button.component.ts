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
    <ng-content></ng-content>
    {{ text }}
  </button>`,
})
export class ButtonComponent {
  /** Texte à afficher sur le bouton */
  @Input() text: string = 'Button';

  /** Type du bouton HTML */
  @Input() type: string = 'button';

  /** Couleur du bouton parmi les thèmes prédéfinis */
  @Input() color:
    | 'red'
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'quaternary'
    | 'quinary' = 'secondary';

  /** Désactive l'arrondi des coins */
  @Input() noRounded: boolean = false;

  /** Active l'arrondi complet des coins */
  @Input() rounded: boolean = false;

  /** État désactivé du bouton */
  @Input() disabled: boolean = false;

  /** Classes CSS personnalisées additionnelles */
  @Input() customClass: string = '';

  /**
   * Calcule et retourne les classes CSS dynamiques du bouton
   * Gère les couleurs, les états (hover, focus, active), les arrondis et l'état désactivé
   * @returns Un objet contenant les classes CSS à appliquer
   */
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
