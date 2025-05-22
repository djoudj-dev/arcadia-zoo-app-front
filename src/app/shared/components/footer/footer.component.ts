import { Component, OnInit, computed, signal } from '@angular/core';
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
export class FooterComponent implements OnInit {
  /** Année courante pour le copyright */
  currentYear = new Date().getFullYear();

  /** Signal pour indiquer si la carte Google Maps est chargée */
  mapLoaded = signal<boolean>(true);

  constructor(private openingHoursService: OpeningHoursService) {}

  ngOnInit(): void {
    // Ajouter un gestionnaire d'erreur global pour les requêtes Google Maps
    window.addEventListener('error', (e) => {
      if (e.filename && (
          e.filename.includes('maps.googleapis.com') ||
          e.message.includes('maps.googleapis.com') ||
          e.message.includes('google.maps')
        )) {
        console.warn('Google Maps a rencontré une erreur, probablement bloqué par un bloqueur de publicités');
        this.mapLoaded.set(false);
        // Empêcher l'erreur de s'afficher dans la console
        e.preventDefault();
        return true;
      }
      return false;
    }, true);
  }

  /** Vérifie si le parc est actuellement ouvert */
  isParkOpen = computed(() => this.openingHoursService.isParkOpen());

  /** Récupère les horaires d'ouverture */
  openingHours = computed(() => this.openingHoursService.openingHours());

  /** Récupère le statut du parc */
  parkStatus = computed(() => this.openingHoursService.parkStatus());
}
