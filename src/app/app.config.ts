import { OverlayModule } from '@angular/cdk/overlay';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/interceptors/auth.interceptor';
import { VisitTrackingService } from './features/dashboard/admin-dashboard/stats-board/visit-stats/services/visit-tracking.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor]) // Ajouter l'intercepteur
    ),
    provideAnimations(),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    importProvidersFrom(OverlayModule),
    VisitTrackingService,
  ],
};
