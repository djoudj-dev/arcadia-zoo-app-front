// src/app/shared/components/alert/alert.component.ts
import { Component, computed } from '@angular/core';
import { AlertService } from './service/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent {
  // Signal pour obtenir le message d'alerte actuel depuis le service
  alertMessage = computed(() => this.alertService.alertMessage());

  constructor(private alertService: AlertService) {}

  /**
   * Efface le message d'alerte en appelant le service
   */
  clearAlert(): void {
    this.alertService.clearAlert();
  }
}
