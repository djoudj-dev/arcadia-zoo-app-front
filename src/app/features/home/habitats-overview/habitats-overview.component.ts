import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Habitat } from '../../dashboard/admin-dashboard/habitat-management/model/habitat.model';
import { HabitatService } from '../../habitats/service/habitat.service';

/**
 * Composant d'aperçu des habitats sur la page d'accueil
 * Affiche une grille des habitats disponibles dans le zoo
 */
@Component({
  selector: 'app-habitats-overview',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './habitats-overview.component.html',
})
export class HabitatsOverviewComponent implements OnInit {
  /** Injection du DestroyRef pour la gestion des souscriptions */
  private readonly destroyRef = inject(DestroyRef);

  /** Signal contenant la liste des habitats */
  habitats = signal<Habitat[]>([]);

  constructor(private readonly habitatService: HabitatService) {}

  /** Initialise le composant en chargeant la liste des habitats */
  ngOnInit() {
    this.loadHabitats();
  }

  /**
   * Charge tous les habitats depuis le service
   * Utilise takeUntilDestroyed pour la gestion automatique des souscriptions
   * Les URLs des images sont déjà formatées par le service
   */
  private loadHabitats(): void {
    this.habitatService
      .getHabitats()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          // Les images sont déjà formatées par le service, pas besoin de les reformater ici
          this.habitats.set(data);
        },
        error: (error) =>
          console.error('Erreur lors du chargement des habitats:', error),
      });
  }
}
