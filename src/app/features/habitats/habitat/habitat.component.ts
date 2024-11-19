import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Animal } from '../../dashboard/admin-dashboard/animal-management/model/animal.model';
import { Habitat } from '../../dashboard/admin-dashboard/habitat-management/model/habitat.model';
import { HabitatService } from '../service/habitat.service';

/**
 * Composant de détail d'un habitat
 * Affiche les informations détaillées d'un habitat et la liste des animaux qui y vivent
 */
@Component({
  selector: 'app-habitat',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './habitat.component.html',
})
export class HabitatComponent implements OnInit {
  /** Signal contenant les données de l'habitat */
  habitat = signal<Habitat | undefined>(undefined);

  /** Signal contenant la liste des animaux de l'habitat */
  animals = signal<Animal[]>([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private habitatService: HabitatService
  ) {}

  /** Initialise le composant en chargeant les données de l'habitat */
  ngOnInit(): void {
    const habitatId = Number(this.route.snapshot.paramMap.get('id'));
    if (habitatId) {
      this.loadHabitat(habitatId);
    }
  }

  /**
   * Charge les informations de l'habitat à partir de son ID
   * Déclenche également le chargement des animaux associés
   * @param habitatId - ID de l'habitat à charger
   */
  private loadHabitat(habitatId: number): void {
    this.habitatService.getHabitatById(habitatId).subscribe({
      next: (data) => {
        if (data) {
          this.habitat.set(data);
          this.loadAnimalsForHabitat(habitatId);
        } else {
          console.error('Habitat non trouvé');
        }
      },
      error: (err) =>
        console.error("Erreur lors de la récupération de l'habitat :", err),
    });
  }

  /**
   * Charge la liste des animaux vivant dans l'habitat
   * @param habitatId - ID de l'habitat dont on veut récupérer les animaux
   */
  private loadAnimalsForHabitat(habitatId: number): void {
    this.habitatService.getAnimalsByHabitatId(habitatId).subscribe({
      next: (animals) => this.animals.set(animals),
      error: (err) =>
        console.error('Erreur lors de la récupération des animaux :', err),
    });
  }

  /** Navigue vers la page d'accueil */
  goBack() {
    this.router.navigate(['/']);
  }
}
