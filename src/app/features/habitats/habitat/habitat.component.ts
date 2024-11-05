import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Habitat } from '../../../core/models/habitat.model';
import { Animal } from '../../../core/models/animal.model';
import { HabitatService } from '../service/habitat.service';
import { BorderCardDirective } from '../../../shared/directives/border-card-habitat/border-card-habitat.directive';
import { environment } from '../../../../environments/environment.development';

/**
 * HabitatComponent - Composant d'affichage détaillé d'un habitat et des animaux associés
 *
 * Ce composant affiche les informations d'un habitat spécifique, incluant
 * le nom, la description, l'image de l'habitat, et la liste des animaux qui y résident.
 */
@Component({
  selector: 'app-habitat',
  standalone: true,
  imports: [RouterLink, ButtonComponent, BorderCardDirective],
  templateUrl: './habitat.component.html',
  styles: [
    `
      span {
        font-weight: bold;
        color: #0e1805;
      }
    `,
  ],
})
export class HabitatComponent implements OnInit {
  /**
   * Signal pour l'objet `Habitat`, utilisé comme entrée (@Input) pour recevoir les données
   * de l'habitat depuis un composant parent ou service.
   */
  habitat = signal<Habitat | undefined>(undefined);

  /**
   * Signal pour stocker et surveiller la liste des animaux associés à l'habitat actuel.
   */
  animals = signal<Animal[]>([]);

  /**
   * URL de base pour les images des habitats, tirée de l'environnement de développement.
   */
  private readonly imageBaseUrl = `${environment.apiUrl}`;

  /**
   * Constructor - Initialise les services requis pour la navigation, l'accès aux paramètres de route,
   * et la récupération des données d'habitat via HabitatService.
   *
   * @param route - Fournit des informations sur la route active, notamment les paramètres de l'URL.
   * @param router - Permet la navigation programmée entre les pages.
   * @param habitatService - Service dédié à la gestion des données de l'habitat.
   */
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly habitatService: HabitatService
  ) {}

  /**
   * ngOnInit - Hook du cycle de vie de Angular qui s'exécute une fois que le composant est initialisé.
   *
   * Cette méthode récupère l'ID de l'habitat depuis les paramètres de route et charge les
   * informations de l'habitat ainsi que les animaux associés via HabitatService.
   */
  ngOnInit(): void {
    const habitat_id = Number(this.route.snapshot.paramMap.get('id'));
    if (habitat_id) {
      this.loadHabitat(habitat_id);
    }
  }

  /**
   * Charge les informations de l'habitat à partir de l'ID fourni et met à jour le signal `habitat`.
   * Si l'image de l'habitat n'est pas un URL absolu, elle est concaténée avec `imageBaseUrl`.
   *
   * @param habitat_id - L'identifiant unique de l'habitat à charger.
   */
  private loadHabitat(habitat_id: number): void {
    this.habitatService.getHabitatById(habitat_id).subscribe({
      next: (data) => {
        if (data) {
          // Concatène l'image si elle n'est pas déjà un lien complet
          data.images = data.images?.startsWith('http')
            ? data.images
            : `${this.imageBaseUrl}/${data.images}`;
          this.habitat.set(data);
          this.loadAnimalsForHabitat(habitat_id);
        } else {
          console.error('Habitat non trouvé');
        }
      },
      error: (err) =>
        console.error("Erreur lors de la récupération de l'habitat :", err),
    });
  }

  /**
   * Récupère les animaux associés à l'habitat donné par l'ID et met à jour le signal `animals`.
   * Ajoute le chemin complet à chaque image d'animal si elle n'est pas un URL absolu.
   *
   * @param habitat_id - L'identifiant de l'habitat pour lequel récupérer les animaux.
   */
  loadAnimalsForHabitat(habitat_id: number): void {
    this.habitatService.getAnimalsByhabitat_id(habitat_id).subscribe({
      next: (animals) => {
        // Ajoute le chemin de base aux images des animaux si nécessaire
        const updatedAnimals = animals.map((animal) => ({
          ...animal,
          image: animal.images?.startsWith('http')
            ? animal.images
            : `${environment.apiUrl}/uploads/${animal.images}`,
        }));
        this.animals.set(updatedAnimals);
      },
      error: (err) =>
        console.error('Erreur lors de la récupération des animaux :', err),
    });
  }

  /**
   * Permet de revenir à la page précédente (page d'accueil ou liste des habitats) via la navigation Angular Router.
   */
  goBack(): void {
    this.router.navigate(['/']);
  }
}
