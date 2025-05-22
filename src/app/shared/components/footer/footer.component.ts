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
      // Vérifier si l'erreur est liée à Google Maps de différentes manières
      if ((e.filename && (
          e.filename.includes('maps.googleapis.com') ||
          e.filename.includes('google.com/maps')
        )) ||
        (e.message && (
          e.message.includes('maps.googleapis.com') ||
          e.message.includes('google.maps') ||
          e.message.includes('gen_204') ||
          e.message.includes('ERR_BLOCKED_BY_CLIENT')
        )) ||
        (e.target && (e.target as HTMLIFrameElement | HTMLImageElement | HTMLScriptElement).src &&
         ((e.target as HTMLIFrameElement | HTMLImageElement | HTMLScriptElement).src.includes('maps.googleapis.com') ||
          (e.target as HTMLIFrameElement | HTMLImageElement | HTMLScriptElement).src.includes('google.com/maps')))
      ) {
        console.warn('Google Maps a rencontré une erreur, probablement bloqué par un bloqueur de publicités');
        this.mapLoaded.set(false);
        // Empêcher l'erreur de s'afficher dans la console
        e.preventDefault();
        return true;
      }
      return false;
    }, true);

    // Ajouter un gestionnaire pour les erreurs de ressources (comme les iframes)
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason &&
          (String(event.reason).includes('maps.googleapis.com') ||
           String(event.reason).includes('google.maps') ||
           String(event.reason).includes('ERR_BLOCKED_BY_CLIENT'))) {
        console.warn('Google Maps promise rejected, probablement bloqué par un bloqueur de publicités');
        this.mapLoaded.set(false);
        event.preventDefault();
      }
    });
  }

  /** Vérifie si le parc est actuellement ouvert */
  isParkOpen = computed(() => this.openingHoursService.isParkOpen());

  /** Récupère les horaires d'ouverture */
  openingHours = computed(() => this.openingHoursService.openingHours());

  /** Récupère le statut du parc */
  parkStatus = computed(() => this.openingHoursService.parkStatus());
}
