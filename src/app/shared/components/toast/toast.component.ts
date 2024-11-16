import { Component, Input } from '@angular/core';

/**
 * Composant Toast réutilisable
 * Affiche des messages de notification temporaires (success/error)
 * Les messages disparaissent automatiquement après 3 secondes
 */
@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div [class]="customClass" role="alert">
      <div [class]="getTypeClass()">
        {{ message }}
      </div>
    </div>
  `,
})
export class ToastComponent {
  @Input() message!: string;
  @Input() type!: 'success' | 'error' | 'warning' | 'info';
  @Input() customClass?: string;

  getTypeClass() {
    // Logique pour les classes CSS selon le type
    const baseClasses = 'p-4 rounded-lg';
    const typeClasses = {
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      info: 'bg-blue-100 text-blue-800',
    };
    return `${baseClasses} ${typeClasses[this.type]}`;
  }
}
