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
    @if(visible) {
    <div [class]="customClass" role="alert">
      <div [class]="getTypeClass()">
        {{ message }}
        @if(type === 'confirm') {
        <div class="flex justify-end gap-2 mt-4">
          <button
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            (click)="onConfirmClick()"
          >
            Supprimer
          </button>
          <button
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            (click)="onCancelClick()"
          >
            Annuler
          </button>
        </div>
        }
      </div>
    </div>
    }
  `,
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() message!: string;
  @Input() type:
    | 'success'
    | 'error'
    | 'warning'
    | 'confirm'
    | 'auth-login'
    | 'auth-logout' = 'success';
  @Input() customClass = '';

  visible = false;
  private onConfirm?: () => void;
  private onCancel?: () => void;
  readonly subscription: Subscription = new Subscription();

  constructor(readonly toastService: ToastService) {}

  ngOnInit() {
    this.subscription.add(
      this.toastService.toast$.subscribe((toast) => {
        this.message = toast.message;
        this.type = toast.type;
        this.onConfirm = toast.onConfirm;
        this.onCancel = toast.onCancel;
        this.visible = true;

        if (toast.duration) {
          setTimeout(() => {
            this.visible = false;
          }, toast.duration);
        }
      })
    );
  }

  getTypeClass() {
    const baseClasses = 'p-4 shadow-lg border-l-8';
    switch (this.type) {
      case 'success':
        return `${baseClasses} bg-white text-green-800 border-green-500`;
      case 'error':
        return `${baseClasses} bg-white text-red-800 border-red-500`;
      case 'warning':
        return `${baseClasses} bg-white text-yellow-800 border-yellow-500`;
      case 'confirm':
        return `${baseClasses} bg-white text-blue-800 border-blue-500`;
      case 'auth-login':
        return `${baseClasses} bg-white text-gray-800 border-green-500`;
      case 'auth-logout':
        return `${baseClasses} bg-white text-gray-800 border-green-500`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border-gray-500`;
    }
  }

  onConfirmClick() {
    if (this.onConfirm) {
      this.onConfirm();
    }
    this.visible = false;
  }

  onCancelClick() {
    if (this.onCancel) {
      this.onCancel();
    }
    this.visible = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
