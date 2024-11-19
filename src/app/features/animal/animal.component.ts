import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Animal } from '../dashboard/admin-dashboard/animal-management/model/animal.model';
import { Habitat } from '../dashboard/admin-dashboard/habitat-management/model/habitat.model';
import { VeterinaryReports } from '../dashboard/veterinary-dashboard/veterinary-reports/model/veterinary-reports.model';
import { AnimalService } from './service/animal.service';

@Component({
  selector: 'app-animal',
  standalone: true,
  imports: [ButtonComponent, DatePipe],
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
  veterinary = signal<VeterinaryReports | undefined>(undefined);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private animalService: AnimalService // Service pour gérer les opérations liées à Animal
  ) {}

  /** Initialisation du composant pour charger les données de l'animal */
  ngOnInit() {
    this.loadAnimal(); // Appel à la méthode de chargement
  }

  /**
   * Charge les informations de l'animal en fonction de l'ID récupéré depuis la route.
   */
  private loadAnimal() {
    const id = Number(this.route.snapshot.paramMap.get('id')); // Récupération de l'ID de l'animal depuis les paramètres de la route
    console.log('Route param ID:', id);

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
