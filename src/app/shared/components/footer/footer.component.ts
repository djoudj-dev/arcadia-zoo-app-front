import { Component, computed } from '@angular/core';
import { OpeningHoursService } from '../../../features/dashboard/admin-dashboard/opening-hours-management/services/opening-hours.service';
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

  constructor(private openingHoursService: OpeningHoursService) {}

  /** Vérifie si le parc est actuellement ouvert */
  isParkOpen = computed(() => this.openingHoursService.isParkOpen());

  /** Récupère les horaires d'ouverture */
  openingHours = computed(() => {
    const hours = this.openingHoursService.openingHours();
    console.log('Mise à jour des horaires dans le footer:', hours);
    return hours;
  });

  /** Récupère le statut du parc */
  parkStatus = computed(() => this.openingHoursService.parkStatus());
}
