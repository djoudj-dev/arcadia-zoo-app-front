import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Composant Modal réutilisable
 * Affiche une fenêtre modale centrée avec un fond semi-transparent
 */
@Component({
  standalone: true,
  selector: 'app-modal',
  template: `
    @if (isOpen) {
    <div
      class="fixed inset-0 bg-secondary bg-opacity-50 flex items-center justify-center z-50"
    >
      <!-- Container principal de la modal -->
      <div
        class="bg-secondary w-full sm:max-w-lg mx-auto p-6 rounded-lg shadow-lg relative"
      >
        <!-- Contenu injecté via ng-content -->
        <ng-content />
      </div>
    </div>
    }
  `,
})
export class ModalComponent {
  /** Contrôle la visibilité de la modal */
  @Input() isOpen = false;

  /** Émet un événement lorsque la modal doit être fermée */
  @Output() close = new EventEmitter<void>();

  /**
   * Méthode pour fermer la modal
   * Émet un événement que le composant parent peut écouter
   */
  closeModal() {
    this.close.emit();
  }
}
