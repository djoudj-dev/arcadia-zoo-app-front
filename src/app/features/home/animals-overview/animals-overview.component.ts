import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment.development'; // Corrigez le chemin ici
import { BorderCardAnimalDirective } from '../../../shared/directives/border-card-animal/border-card-animal.directive';
import { RandomAnimalsDirective } from '../../../shared/directives/random-animals/random-animals.directive';
import { Animal } from '../../admin-dashboard/animal-management/model/animal.model';
import { AnimalOverviewService } from './service/animal-overview.service';

@Component({
  selector: 'app-animals-overview',
  standalone: true,
  imports: [BorderCardAnimalDirective, RouterLink, RandomAnimalsDirective],
  templateUrl: './animals-overview.component.html',
})
export class AnimalsOverviewComponent implements OnInit {
  animal = signal<Animal | undefined>(undefined);
  animals = signal<Animal[]>([]);
  displayedAnimals = signal<Animal[]>([]);

  imageBaseUrl = `${environment.apiUrl}`;

  constructor(
    private animalOverviewService: AnimalOverviewService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.animalOverviewService.getAnimals().subscribe((data) => {
      this.animals.set(data);
      this.displayedAnimals.set(this.getRandomAnimals(this.animals(), 3));
    });
  }

  getRandomAnimals(animals: Animal[], count: number): Animal[] {
    return animals.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  onUpdateDisplayedAnimals(event: Animal[]): void {
    this.displayedAnimals.set(event);
  }
}
