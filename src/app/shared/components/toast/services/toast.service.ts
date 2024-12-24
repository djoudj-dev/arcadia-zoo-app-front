import { Injectable } from '@angular/core';
import { Subject, timer } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'confirm' | 'warning';
  duration?: number;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastSubject = new Subject<Toast>();
  private readonly hideToastSubject = new Subject<void>();

  toast$ = this.toastSubject.asObservable();
  hideToast$ = this.hideToastSubject.asObservable();

  showSuccess(message: string, duration: number = 3000) {
    this.toastSubject.next({ message, type: 'success', duration });

    timer(duration).subscribe(() => {
      this.hideToastSubject.next();
    });
  }

  showWarning(message: string, duration: number = 3000) {
    this.toastSubject.next({ message, type: 'warning', duration });

    timer(duration).subscribe(() => {
      this.hideToastSubject.next();
    });
  }

  showError(message: string, duration: number = 3000) {
    this.toastSubject.next({ message, type: 'error', duration });

    timer(duration).subscribe(() => {
      this.hideToastSubject.next();
    });
  }

  showConfirm(message: string, onConfirm: () => void, onCancel: () => void) {
    this.toastSubject.next({
      message,
      type: 'confirm',
      onConfirm,
      onCancel,
    });
  }

  hideToast() {
    this.hideToastSubject.next();
  }
}
