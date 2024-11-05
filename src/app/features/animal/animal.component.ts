import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VetNote } from '../../core/models/vetnote.model';
import { DatePipe } from '@angular/common';
import { NavComponent } from '../../shared/components/header/navbar/nav.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AnimalService } from './service/animal.service';
import { Animal } from '../admin-dashboard/animal-management/model/animal.model';
import { Habitat } from '../admin-dashboard/habitat-management/model/habitat.model';

@Component({
  selector: 'app-animal',
  standalone: true,
  imports: [
    RouterLink,
    NavComponent,
    FooterComponent,
    ButtonComponent,
    DatePipe,
  ],
  templateUrl: './animal.component.html',
  styles: [
    `
      span {
        font-weight: bold;
        color: #0e1805;
      }
    `,
  ],
})
export class AnimalComponent implements OnInit {
  /** Signal pour stocker les informations */
  animal = signal<Animal | undefined>(undefined);
  habitat = signal<Habitat | undefined>(undefined);
  vetNote = signal<VetNote | undefined>(undefined);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private animalService: AnimalService // Service pour gérer les opérations liées à Animal
  ) {}

  /** Initialisation du composant pour charger les données de l'animal */
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id')); // Récupération de l'ID de l'animal depuis les paramètres de la route
    console.log('Route param ID:', id);

    this.loadAnimal(id); // Chargement des données de l'animal par ID
  }

  /**
   * Charge les informations de l'animal en fonction de l'ID.
   * @param id - Identifiant de l'animal à charger
   */
  private loadAnimal(id: number) {
    this.animalService.getAnimalById(id).subscribe({
      next: (animal) => {
        this.animal.set(animal);

        // Si l'animal a été trouvé, charger son habitat associé
        if (animal) {
          this.loadHabitat(animal.habitat_id);
        }
      },
      error: (error) =>
        console.error("Erreur lors de la récupération de l'animal :", error),
    });
  }

  /**
   * Charge les informations de l'habitat associé à l'animal depuis le backend.
   * @param habitat_id - Identifiant de l'habitat associé
   */
  private loadHabitat(habitat_id: number | undefined) {
    if (habitat_id != null) {
      this.animalService.getHabitatById(habitat_id).subscribe({
        next: (habitat) => {
          this.habitat.set(habitat); // Mise à jour du signal de l'habitat
        },
        error: (error) =>
          console.error("Erreur lors de la récupération de l'habitat :", error),
      });
    }
  }

  /** Retour à la page d'accueil */
  goBack() {
    this.router.navigate(['/']);
  }

  /**
   * Redirection vers la page de l'habitat associé.
   * Vérifie si l'ID de l'habitat est valide avant de naviguer.
   */
  goHabitat() {
    const habitat_id = this.habitat()?.id_habitat;
    if (habitat_id) {
      this.router.navigate(['/habitat', habitat_id]);
    }
  }
}
