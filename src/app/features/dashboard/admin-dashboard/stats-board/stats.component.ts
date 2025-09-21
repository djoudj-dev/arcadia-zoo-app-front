import { Component } from '@angular/core';
import { CountResourceComponent } from './counts-resource/count-resource.component';

/**
 * Composant principal des statistiques
 * Agrège et affiche les différents composants de statistiques
 */
@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  imports: [CountResourceComponent],
})
export class StatsComponent {}
