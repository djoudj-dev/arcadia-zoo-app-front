import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService } from './services/toast.service';

/**
 * Composant Toast réutilisable
 * Affiche des messages de notification temporaires (success/error)
 * Les messages disparaissent automatiquement après 3 secondes
 */
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
    <div
      class="mb-4 transition-opacity duration-300"
      [class.opacity-0]="!visible"
      role="alert"
    >
      <div [class]="getTypeClass()">
        {{ currentMessage }}
      </div>
    </div>
    }
  `,
})
export class ToastComponent implements OnInit, OnDestroy {
  visible = false;
  currentMessage = '';
  currentType: 'success' | 'error' = 'success';
  private subscription: Subscription = new Subscription();

  @Input() message!: string;
  @Input() type!: string;
  @Input() customClass!: string;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.subscription.add(
      this.toastService.toast$.subscribe((toast) => {
        this.currentMessage = toast.message;
        this.currentType = toast.type;
        this.visible = true;
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

  getTypeClass() {
    const baseClasses = 'p-4 rounded-lg shadow-lg w-full';
    const typeClasses = {
      success: 'bg-green-100 text-green-800 border-l-4 border-green-500',
      error: 'bg-red-100 text-red-800 border-l-4 border-red-500',
    };
    return `${baseClasses} ${typeClasses[this.currentType]}`;
  }
}
