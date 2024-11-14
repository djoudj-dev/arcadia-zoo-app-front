import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
    <div
      [ngClass]="{
        'bg-green-500': type === 'success',
        'bg-red-500': type === 'error'
      }"
      class="absolute top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg text-white shadow-lg z-50 transition-all duration-300 w-4/5 text-center"
      [class.opacity-0]="!visible"
    >
      {{ message }}
    </div>
    }
  `,
})
export class ToastComponent implements OnInit, OnDestroy {
  visible = false;
  message = '';
  type: 'success' | 'error' = 'success';
  private subscription: Subscription | null = null;
  private hideTimeout: number | undefined;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.subscription = this.toastService.toast$.subscribe((toast) => {
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
      }

      this.message = toast.message;
      this.type = toast.type;
      this.visible = true;

      this.hideTimeout = window.setTimeout(() => {
        this.visible = false;
      }, 3000);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }
}
