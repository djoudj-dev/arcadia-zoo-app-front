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
      class="transition-opacity duration-300"
      [class.opacity-0]="!visible"
      [class]="customClass"
      role="alert"
    >
      <div [class]="getTypeClass()">
        {{ message }}
      </div>
    </div>
    }
  `,
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() message!: string;
  @Input() type: 'success' | 'error' = 'success';
  @Input() customClass = '';

  visible = false;
  private subscription: Subscription = new Subscription();

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    // Si des inputs sont fournis, afficher directement
    if (this.message) {
      this.visible = true;
      setTimeout(() => {
        this.visible = false;
      }, 3000);
    }

    // Écouter aussi le service
    this.subscription.add(
      this.toastService.toast$.subscribe((toast) => {
        this.message = toast.message;
        this.type = toast.type;
        this.visible = true;

        setTimeout(() => {
          this.visible = false;
        }, 3000);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getTypeClass() {
    const baseClasses = 'p-4 rounded-lg shadow-lg';
    const typeClasses = {
      success: 'bg-green-100 text-green-800 border-l-4 border-green-500',
      error: 'bg-red-100 text-red-800 border-l-4 border-red-500',
    };
    return `${baseClasses} ${typeClasses[this.type]}`;
  }
}
