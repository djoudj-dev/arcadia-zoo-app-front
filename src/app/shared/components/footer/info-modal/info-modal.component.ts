import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Composant modal pour les informations d'accès et horaires
 */
@Component({
  selector: 'app-info-modal',
  standalone: true,
  imports: [],
  templateUrl: './info-modal.component.html',
})
export class InfoModalComponent {
  /** Contrôle si la modal est ouverte */
  @Input() isOpen = false;

  /** Émet un événement quand la modal est fermée */
  @Output() closed = new EventEmitter<void>();

  /** Ferme la modal */
  close(): void {
    this.closed.emit();
  }
}
