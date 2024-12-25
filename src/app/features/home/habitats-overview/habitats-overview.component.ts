import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
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
   */
  private loadHabitats(): void {
    this.habitatService
      .getHabitats()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.habitats.set(data.map(this.formatHabitatImage));
        },
        error: (error) =>
          console.error('Erreur lors du chargement des habitats:', error),
      });
  }

  /**
   * Formate l'URL de l'image d'un habitat
   * @param habitat - L'habitat dont l'image doit être formatée
   * @returns L'habitat avec l'URL de l'image formatée
   */
  private formatHabitatImage(habitat: Habitat): Habitat {
    let formattedImage = '';
    if (habitat.images) {
      formattedImage = habitat.images.startsWith('http')
        ? habitat.images
        : `${environment.apiUrl}/uploads/${habitat.images}`;
    }

    return {
      ...habitat,
      images: formattedImage,
    };
  }
}
