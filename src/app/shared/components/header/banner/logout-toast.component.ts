import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService } from '../../../components/toast/services/toast.service';

@Component({
  selector: 'app-logout-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible && isLogoutMessage) {
    <div
      class="absolute top-4 right-4 z-50 transition-all duration-300 ease-in-out"
      [class]="
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
      "
      role="alert"
    >
      <div
        class="p-3 rounded-lg shadow-lg bg-secondary/95 text-primary border-l-4 border-tertiary backdrop-blur-sm"
      >
        {{ currentMessage }}
      </div>
    </div>
    }
  `,
})
export class LogoutToastComponent implements OnInit, OnDestroy {
  visible = false;
  currentMessage = '';
  isLogoutMessage = false;
  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly toastService: ToastService) {}

  ngOnInit() {
    this.subscription.add(
      this.toastService.toast$.subscribe((toast) => {
        this.currentMessage = toast.message;
        this.isLogoutMessage = toast.message
          .toLowerCase()
          .includes('déconnexion');
        if (this.isLogoutMessage) {
          this.visible = true;
          setTimeout(() => {
            this.visible = false;
          }, 2500);
        }
      })
    );

    this.subscription.add(
      this.toastService.hideToast$.subscribe(() => {
        this.visible = false;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
