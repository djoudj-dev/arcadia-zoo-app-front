import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Habitat } from '../../../core/models/habitat.model';
import { Animal } from '../../../core/models/animal.model';
import { HabitatService } from '../service/habitat.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BorderCardDirective } from '../../../shared/directives/border-card-habitat/border-card-habitat.directive';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-habitat',
  standalone: true,
  imports: [RouterLink, ButtonComponent, BorderCardDirective],
  templateUrl: './habitat.component.html',
})
export class HabitatComponent implements OnInit {
  /**
   * Signal pour les objets `Habitat` & ``Animal.
   * Ces signaux sont utilisés pour mettre à jour les données de l'habitat et des animaux
   */
  habitat = signal<Habitat | undefined>(undefined);

  /**
   * Signal pour stocker et surveiller la liste des animaux associés à l'habitat actuel.
   */
  animals = signal<Animal[]>([]);

  /**
   * URL de base pour les images, dérivée de l'environnement de développement.
   * Utilisée pour construire l'URL complète des images d'habitat et d'animaux.
   */
  private imageBaseUrl = `${environment.apiUrl}`;

  /**
   * Constructeur du composant, injectant les services nécessaires.
   * @param route - Fournit des informations sur la route active, notamment les paramètres de l'URL.
   * @param router - Service de navigation Angular pour rediriger l'utilisateur.
   * @param habitatService - Service pour gérer les opérations liées aux habitats et aux animaux.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private habitatService: HabitatService
  ) {}

  /**
   * Hook de cycle de vie appelé à l'initialisation du composant.
   * Récupère l'ID de l'habitat depuis l'URL et charge les données de l'habitat et des animaux associés.
   */
  ngOnInit(): void {
    const habitatId = Number(this.route.snapshot.paramMap.get('id'));
    if (habitatId) {
      this.loadHabitat(habitatId);
    }
  }

  /**
   * Charge les informations d'un habitat en fonction de son ID et met à jour le signal `habitat`.
   * Si l'image n'a pas une URL complète, elle est complétée avec `imageBaseUrl`.
   *
   * @param habitatId - L'identifiant unique de l'habitat à charger.
   */
  private loadHabitat(habitat_id: number): void {
    this.habitatService.getHabitatById(habitat_id).subscribe({
      next: (data) => {
        if (data) {
          data.images = this.formatImageUrl(data.images);
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
   * Récupère les animaux associés à un habitat donné par son ID et met à jour le signal `animals`.
   * Si l'image de l'animal n'a pas une URL complète, elle est complétée avec `imageBaseUrl`.
   *
   * @param habitatId - L'identifiant de l'habitat pour lequel récupérer les animaux.
   */
  private loadAnimalsForHabitat(habitatId: number): void {
    this.habitatService.getAnimalsByHabitatId(habitatId).subscribe({
      next: (animals) => {
        // Ajoute le chemin de base aux images des animaux si nécessaire
        const updatedAnimals = animals.map((animal) => ({
          ...animal,
          image: animal.images?.startsWith('http')
            ? animal.images
            : `${environment.apiUrl}/uploads/${animal.images}`,
        }));
        console.log(
          'Animaux après ajout du chemin complet des images :',
          updatedAnimals
        );
        this.animals.set(updatedAnimals);
      },
      error: (err) =>
        console.error('Erreur lors de la récupération des animaux :', err),
    });
  }

  /**
   * Formate l'URL de l'image en ajoutant `imageBaseUrl` si l'URL n'est pas absolue.
   *
   * @param imagePath - Le chemin de l'image à formater.
   * @returns - L'URL complète de l'image.
   */
  private formatImageUrl(imagePath: string): string {
    return imagePath.startsWith('http')
      ? imagePath
      : `${this.imageBaseUrl}/${imagePath}`;
  }

  /**
   * Redirige l'utilisateur vers la page d'accueil ou la liste des habitats.
   * Utilisé pour le bouton de retour.
   */
  goBack() {
    this.router.navigate(['/']);
  }
}
