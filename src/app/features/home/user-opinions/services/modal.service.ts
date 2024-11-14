import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '../../../../shared/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  constructor(private toastService: ToastService) {}

  openModal() {
    this.isOpenSubject.next(true);
  }

  closeModal() {
    this.isOpenSubject.next(false);
  }

  showSuccessMessage(message: string) {
    this.toastService.showSuccess(message);
    setTimeout(() => {
      this.closeModal();
    }, 3000);
  }

  showErrorMessage(message: string) {
    this.toastService.showError(message);
  }
}
