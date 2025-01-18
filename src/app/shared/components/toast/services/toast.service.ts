import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  message: string;
  type:
    | 'success'
    | 'error'
    | 'confirm'
    | 'warning'
    | 'auth-login'
    | 'auth-logout';
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
  }

  showWarning(message: string, duration: number = 3000) {
    this.toastSubject.next({ message, type: 'warning', duration });
  }

  showError(message: string, duration: number = 3000) {
    this.toastSubject.next({ message, type: 'error', duration });
  }

  showAuthLogin(message: string, duration: number = 5000) {
    this.toastSubject.next({ message, type: 'auth-login', duration });
  }

  showAuthLogout(message: string, duration: number = 5000) {
    this.toastSubject.next({ message, type: 'auth-logout', duration });
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
