import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

/**
 * Composant Footer qui gère le pied de page de l'application
 * Ce composant est autonome (standalone) et utilise le ButtonComponent
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  /**
   * Ouvre la fenêtre modale en manipulant les classes CSS
   * Retire la classe 'hidden' et ajoute la classe 'flex' pour afficher la modale
   */
  openModal() {
    const modal = document.getElementById('modal');
    modal?.classList.remove('hidden');
    modal?.classList.add('flex');
  }

  /**
   * Ferme la fenêtre modale en manipulant les classes CSS
   * Ajoute la classe 'hidden' et retire la classe 'flex' pour masquer la modale
   */
  closeModal() {
    const modal = document.getElementById('modal');
    modal?.classList.add('hidden');
    modal?.classList.remove('flex');
  }
}
