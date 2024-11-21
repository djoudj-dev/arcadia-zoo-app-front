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
      class="fixed top-4 right-4 transition-opacity duration-300 z-50"
      [class.opacity-0]="!visible"
      [class]="customClass"
      role="alert"
    >
      <div [class]="getTypeClass()">
        {{ message }}
        @if (type === 'confirm') {
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
  @Input() type: 'success' | 'error' | 'confirm' = 'success';
  @Input() customClass = '';

  visible = false;
  private onConfirm?: () => void;
  private onCancel?: () => void;
  private subscription: Subscription = new Subscription();

  constructor(private toastService: ToastService) {}

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
    const baseClasses = 'p-4 rounded-lg shadow-lg';
    const typeClasses = {
      success: 'bg-green-100 text-green-800 border-l-4 border-green-500',
      error: 'bg-red-100 text-red-800 border-l-4 border-red-500',
      confirm: 'bg-white text-gray-800 border-l-4 border-yellow-500',
    };
    return `${baseClasses} ${typeClasses[this.type]}`;
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
