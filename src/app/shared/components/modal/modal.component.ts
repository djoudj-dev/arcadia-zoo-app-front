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
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <!-- Fond semi-transparent -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        (click)="closeModal()"
      ></div>

      <!-- Centrage du modal -->
      <div
        class="flex min-h-full items-center justify-center p-4 text-center sm:p-0"
      >
        <!-- Contenu du modal avec largeur maximale -->
        <div
          class="relative transform overflow-hidden transition-all max-w-lg w-full mx-auto"
        >
          <ng-content />
        </div>
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
