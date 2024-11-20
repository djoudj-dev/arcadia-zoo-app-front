import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NotificationService } from './service/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2">
      @for (notification of notificationService.notifications$ | async; track
      notification.id) {
      <div
        class="p-4 rounded-lg shadow-lg text-white transform transition-all duration-500 ease-in-out"
        [class]="
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        "
      >
        {{ notification.message }}
      </div>
      }
    </div>
  `,
})
export class NotificationComponent {
  constructor(public notificationService: NotificationService) {}
}
