import { Component } from '@angular/core';
import { SocialLinksComponent } from './social-links/social-links.component';

/**
 * Composant Footer qui gère le pied de page de l'application
 * Affiche les informations de contact, horaires et réseaux sociaux
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [SocialLinksComponent],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  /** Année courante pour le copyright */
  currentYear = new Date().getFullYear();

  /** Horaires d'ouverture */
  openingHours = [
    { days: 'Lundi - Vendredi', hours: '9h00 - 19h00' },
    { days: 'Samedi - Dimanche', hours: '9h00 - 20h00' },
  ];
}
