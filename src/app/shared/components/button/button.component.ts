import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-button',
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input() text: string = 'Button'; // Texte par défaut
  @Input() type: string = 'button'; // Type de bouton (submit, button, reset)
}
