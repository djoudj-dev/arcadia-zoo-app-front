import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertSubject = new BehaviorSubject<string | null>(null);
  alertMessage$: Observable<string | null> = this.alertSubject.asObservable();

  showAlert(message: string): void {
    this.alertSubject.next(message);
  }

  clearAlert(): void {
    this.alertSubject.next(null);
  }
}
