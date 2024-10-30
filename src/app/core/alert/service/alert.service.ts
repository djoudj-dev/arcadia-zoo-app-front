// src/app/shared/components/alert/service/alert.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  // Signal pour le message d'alerte
  alertMessage = signal<string | null>(null);
  // Signal pour le type d'alerte ('success', 'error', 'info')
  alertType = signal<'success' | 'error' | 'info' | null>(null);

  /**
   * Définit un message d'alerte avec un type spécifié.
   * @param message Le message à afficher dans l'alerte.
   * @param type Le type d'alerte (par défaut 'info').
   */
  setAlert(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.alertMessage.set(message); // Met à jour le message d'alerte
    this.alertType.set(type); // Met à jour le type d'alerte
  }

  /**
   * Efface le message et le type d'alerte actuels.
   */
  clearAlert(): void {
    this.alertMessage.set(null); // Réinitialise le message d'alerte
    this.alertType.set(null); // Réinitialise le type d'alerte
  }
}
