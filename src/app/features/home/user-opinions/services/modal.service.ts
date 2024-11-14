import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  open() {
    this.isOpenSubject.next(true);
  }

  close() {
    this.isOpenSubject.next(false);
  }

  closeWithDelay(delay: number = 3000) {
    setTimeout(() => {
      this.close();
    }, delay);
  }
}
