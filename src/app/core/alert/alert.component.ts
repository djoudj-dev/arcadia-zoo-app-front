import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertService } from './service/alert.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent {
  alertMessage$: Observable<string | null>;

  constructor(private alertService: AlertService) {
    this.alertMessage$ = this.alertService.alertMessage$;
  }

  clearAlert(): void {
    this.alertService.clearAlert();
  }
}
