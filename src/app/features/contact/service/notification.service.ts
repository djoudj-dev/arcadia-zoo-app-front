import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error';
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notifications.asObservable();
  private nextId = 0;

  show(message: string, type: 'success' | 'error'): void {
    const notification: Notification = {
      message,
      type,
      id: this.nextId++,
    };

    const currentNotifications = this.notifications.getValue();
    this.notifications.next([...currentNotifications, notification]);

    setTimeout(() => {
      this.remove(notification.id);
    }, 3000);
  }

  private remove(id: number): void {
    const currentNotifications = this.notifications.getValue();
    this.notifications.next(
      currentNotifications.filter((notification) => notification.id !== id)
    );
  }
}
