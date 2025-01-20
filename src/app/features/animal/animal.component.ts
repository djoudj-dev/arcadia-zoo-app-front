import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Animal } from '../dashboard/admin-dashboard/animal-management/model/animal.model';
import { Habitat } from '../dashboard/admin-dashboard/habitat-management/model/habitat.model';
import { VisitTrackerDirective } from '../dashboard/admin-dashboard/stats-board/visit-stats/directives/visit-tracker.directive';
import { VeterinaryReports } from '../dashboard/veterinary-dashboard/veterinary-reports/model/veterinary-reports.model';
import { VeterinaryReportsService } from '../dashboard/veterinary-dashboard/veterinary-reports/service/veterinary-reports.service';
import { AnimalService } from './service/animal.service';

/**
 * Composant de détail d'un animal
 * Affiche les informations détaillées d'un animal spécifique, son habitat et son dernier rapport vétérinaire
 */
@Component({
  selector: 'app-animal',
  standalone: true,
  imports: [CommonModule, ButtonComponent, DatePipe, VisitTrackerDirective],
  templateUrl: './animal.component.html',
  styles: [],
})
export class AnimalComponent implements OnInit {
  /** Utilisation de signaux pour la réactivité */
  animal = signal<Animal | undefined>(undefined);
  habitat = signal<Habitat | undefined>(undefined);
  latestVeterinaryReport = signal<VeterinaryReports | undefined>(undefined);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly animalService: AnimalService,
    private readonly veterinaryReportsService: VeterinaryReportsService
  ) {}

  /** Initialise le composant en chargeant les données de l'animal */
  ngOnInit() {
    this.loadAnimal();
  }

  /**
   * Charge les informations de l'animal à partir de l'ID dans l'URL
   * Déclenche également le chargement de l'habitat et du rapport vétérinaire associés
   */
  private loadAnimal() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.animalService.getAnimalById(id).subscribe({
      next: (animal) => {
        this.animal.set(animal);
        if (animal) {
          this.loadHabitat(animal.habitat_id);
          this.loadVeterinaryReports(animal.id_animal);
        }
      },
      error: (error) =>
        console.error("Erreur lors de la récupération de l'animal :", error),
    });
  }

  /**
   * Charge les informations de l'habitat associé à l'animal
   * @param habitat_id - ID de l'habitat à charger
   */
  private loadHabitat(habitat_id: number | undefined) {
    if (habitat_id != null) {
      this.animalService.getHabitatById(habitat_id).subscribe({
        next: (habitat) => this.habitat.set(habitat),
        error: (error) =>
          console.error("Erreur lors de la récupération de l'habitat :", error),
      });
    }
  }

  /** Navigue vers la page d'accueil */
  goBack() {
    this.router.navigate(['/']);
  }

  /** Navigue vers la page de l'habitat de l'animal */
  goHabitat() {
    const habitat_id = this.habitat()?.id_habitat;
    if (habitat_id) {
      this.router.navigate(['/habitat', habitat_id]);
    }
  }

  /**
   * Charge le dernier rapport vétérinaire de l'animal
   * @param animalId - ID de l'animal dont on veut récupérer le rapport
   */
  private loadVeterinaryReports(animalId: number) {
    this.veterinaryReportsService
      .getAllReports()
      .pipe(
        map(
          (response) =>
            response.data
              .filter((report) => report.id_animal === animalId)
              .sort(
                (a, b) =>
                  new Date(b.visit_date).getTime() -
                  new Date(a.visit_date).getTime()
              )[0]
        )
      )
      .subscribe({
        next: (latestReport) => this.latestVeterinaryReport.set(latestReport),
        error: (error) =>
          console.error(
            'Erreur lors du chargement du dernier rapport vétérinaire:',
            error
          ),
      });
  }

  /**
   * Retourne les classes CSS pour l'état de santé de l'animal
   * @param state - État de santé de l'animal
   * @returns Classes CSS correspondant à l'état de santé
   */
  getStateClass(state: string): string {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-semibold';
    switch (state.toLowerCase()) {
      case 'bonne santé':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'surveillance':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'malade':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }
}
