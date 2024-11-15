import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
      [ngClass]="{
        'bg-green-500': type === 'success',
        'bg-red-500': type === 'error'
      }"
      class="absolute top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg text-white shadow-lg z-50 transition-all duration-300 w-4/5 text-center"
      [class.opacity-0]="!visible"
    >
      <!-- Message du toast -->
      {{ message }}
    </div>
    }
  `,
})
export class ToastComponent implements OnInit, OnDestroy {
  /** Contrôle la visibilité du toast */
  visible = false;

  /** Message à afficher dans le toast */
  message = '';

  /** Type du toast qui détermine sa couleur */
  type: 'success' | 'error' = 'success';

  /** Souscription aux événements du service Toast */
  private subscription: Subscription | null = null;

  /** ID du timeout pour masquer le toast */
  private hideTimeout: number | undefined;

  constructor(private toastService: ToastService) {}

  /**
   * Initialise la souscription aux événements du toast
   * Configure l'affichage et la disparition automatique des messages
   */
  ngOnInit() {
    this.subscription = this.toastService.toast$.subscribe((toast) => {
      // Annule le timeout précédent si un nouveau toast arrive
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
      }

      // Configure le nouveau toast
      this.message = toast.message;
      this.type = toast.type;
      this.visible = true;

      // Programme la disparition du toast après 3 secondes
      this.hideTimeout = window.setTimeout(() => {
        this.visible = false;
      }, 3000);
    });
  }

  /**
   * Nettoie les souscriptions et timeouts lors de la destruction du composant
   */
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }
}
