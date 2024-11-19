import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { RandomAnimalsDirective } from '../../../shared/directives/random-animals/random-animals.directive';
import { Animal } from '../../dashboard/admin-dashboard/animal-management/model/animal.model';
import { AnimalOverviewService } from './service/animal-overview.service';

/**
 * Composant d'aperçu des animaux sur la page d'accueil
 * Affiche une sélection aléatoire d'animaux du zoo
 */
@Component({
  selector: 'app-animals-overview',
  standalone: true,
  imports: [RouterLink, RandomAnimalsDirective],
  templateUrl: './animals-overview.component.html',
})
export class AnimalsOverviewComponent implements OnInit {
  /** Signal contenant l'animal sélectionné */
  animal = signal<Animal | undefined>(undefined);

  /** Signal contenant tous les animaux */
  animals = signal<Animal[]>([]);

  /** Signal contenant les animaux affichés aléatoirement */
  displayedAnimals = signal<Animal[]>([]);

  /** URL de base pour les images */
  imageBaseUrl = `${environment.apiUrl}`;

  constructor(
    private animalOverviewService: AnimalOverviewService,
    private route: ActivatedRoute
  ) {}

  /** Initialise le composant en chargeant les animaux */
  ngOnInit(): void {
    this.loadAnimals();
  }

  /**
   * Charge tous les animaux et sélectionne un échantillon aléatoire
   */
  private loadAnimals(): void {
    this.animalOverviewService.getAnimals().subscribe({
      next: (data) => {
        this.animals.set(data);
        this.displayedAnimals.set(this.getRandomAnimals(this.animals(), 3));
      },
      error: (error) =>
        console.error('Erreur lors du chargement des animaux:', error),
    });
  }

  /**
   * Sélectionne un nombre aléatoire d'animaux
   * @param animals - Liste complète des animaux
   * @param count - Nombre d'animaux à sélectionner
   * @returns Liste aléatoire d'animaux
   */
  getRandomAnimals(animals: Animal[], count: number): Animal[] {
    return animals.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  /**
   * Met à jour les animaux affichés
   * @param event - Nouveaux animaux à afficher
   */
  onUpdateDisplayedAnimals(event: Animal[]): void {
    this.displayedAnimals.set(event);
  }
}
