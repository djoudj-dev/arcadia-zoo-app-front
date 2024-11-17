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
      class="fixed top-4 right-4 z-50 transition-opacity duration-300"
      [class.opacity-0]="!visible"
      role="alert"
    >
      <div
        class="p-4 rounded-lg shadow-lg min-w-[300px] bg-red-100 text-red-800 border-l-4 border-red-500"
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
  private subscription: Subscription = new Subscription();

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.subscription.add(
      this.toastService.toast$.subscribe((toast) => {
        this.currentMessage = toast.message;
        // Vérifie si c'est un message de déconnexion
        this.isLogoutMessage = toast.message
          .toLowerCase()
          .includes('déconnexion');
        if (this.isLogoutMessage) {
          this.visible = true;
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
