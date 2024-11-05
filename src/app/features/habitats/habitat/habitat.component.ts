import { Component, OnInit, signal, Input } from '@angular/core';
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
  @Input() habitat = signal<Habitat | undefined>(undefined);

  /**
   * Signal pour stocker et surveiller la liste des animaux associés à l'habitat actuel.
   */
  animals = signal<Animal[]>([]);

  /**
   * URL de base pour les images des habitats, tirée de l'environnement de développement.
   */
  private readonly imageBaseUrl = `${environment.apiUrl}/uploads/img-habitats`;

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
    const habitatId = Number(this.route.snapshot.paramMap.get('id'));
    if (habitatId) {
      this.loadHabitat(habitatId);
    }
  }

  /**
   * Charge les informations de l'habitat à partir de l'ID fourni et met à jour le signal `habitat`.
   * Si l'image de l'habitat n'est pas un URL absolu, elle est concaténée avec `imageBaseUrl`.
   *
   * @param habitatId - L'identifiant unique de l'habitat à charger.
   */
  private loadHabitat(habitatId: number): void {
    this.habitatService.getHabitatById(habitatId).subscribe({
      next: (data) => {
        if (data) {
          // Concatène l'image si elle n'est pas déjà un lien complet
          data.images = data.images?.startsWith('http')
            ? data.images
            : `${this.imageBaseUrl}/${data.images}`;
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
   * Récupère les animaux associés à l'habitat donné par l'ID et met à jour le signal `animals`.
   * Ajoute le chemin complet à chaque image d'animal si elle n'est pas un URL absolu.
   *
   * @param habitatId - L'identifiant de l'habitat pour lequel récupérer les animaux.
   */
  private loadAnimalsForHabitat(habitatId: number): void {
    this.habitatService.getAnimalsByHabitatId(habitatId).subscribe({
      next: (animals) => {
        // Ajoute le chemin de base aux images des animaux si nécessaire
        const updatedAnimals = animals.map((animal) => ({
          ...animal,
          image: animal.image?.startsWith('http')
            ? animal.image
            : `${environment.apiUrl}/uploads/${animal.image}`,
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
