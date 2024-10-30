// src/app/core/services/alert.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  // Signal pour stocker le message d'alerte actuel
  alertMessage = signal<string | null>(null);

  /**
   * Affiche un message d'alerte.
   * @param message - Le message d'alerte à afficher.
   */
  showAlert(message: string): void {
    this.alertMessage.set(message);
    // Efface automatiquement le message après 3 secondes
    setTimeout(() => this.clearAlert(), 3000);
  }

  /**
   * Efface le message d'alerte.
   */
  clearAlert(): void {
    this.alertMessage.set(null);
  }
}
