// src/app/shared/components/alert/alert.component.ts
import { Component, computed } from '@angular/core';
import { AlertService } from './service/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent {
  // Utilisation de computed pour obtenir dynamiquement le message et le type d'alerte
  alertMessage = computed(() => this.alertService.alertMessage());
  alertType = computed(() => this.alertService.alertType());

  constructor(private alertService: AlertService) {}

  /**
   * Efface le message d'alerte actuel en appelant le service d'alerte.
   */
  clearAlert(): void {
    this.alertService.clearAlert();
  }
}
