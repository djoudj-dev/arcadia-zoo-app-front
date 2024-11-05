import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HabitatService } from '../service/habitat.service';
import { Animal } from '../../admin-dashboard/animal-management/model/animal.model';
import { Habitat } from '../../admin-dashboard/habitat-management/model/habitat.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BorderCardDirective } from '../../../shared/directives/border-card-habitat/border-card-habitat.directive';

@Component({
  selector: 'app-habitat',
  standalone: true,
  imports: [RouterLink, ButtonComponent, BorderCardDirective],
  templateUrl: './habitat.component.html',
})
export class HabitatComponent implements OnInit {
  habitat = signal<Habitat | undefined>(undefined);
  animals = signal<Animal[]>([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private habitatService: HabitatService
  ) {}

  ngOnInit(): void {
    const habitatId = Number(this.route.snapshot.paramMap.get('id'));
    if (habitatId) {
      this.loadHabitat(habitatId);
    }
  }

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

  private loadAnimalsForHabitat(habitatId: number): void {
    this.habitatService.getAnimalsByHabitatId(habitatId).subscribe({
      next: (animals) => this.animals.set(animals),
      error: (err) =>
        console.error('Erreur lors de la récupération des animaux :', err),
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
