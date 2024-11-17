import { Component, OnInit, signal } from '@angular/core';
import { Animal } from '../admin-dashboard/animal-management/model/animal.model';
import { Habitat } from '../admin-dashboard/habitat-management/model/habitat.model';
import { HabitatService } from '../../habitats/service/habitat.service';
import { AnimalService } from '../../animal/service/animal.service';

@Component({
  selector: 'app-veterinary-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './veterinary-dashboard.component.html',
})
export class VeterinaryDashboardComponent implements OnInit {
  habitats = signal<Habitat[]>([]);
  animals = signal<Animal[]>([]);

  constructor(
    private habitatService: HabitatService,
    private animalService: AnimalService
  ) {}

  ngOnInit(): void {
    this.loadHabitats();
    this.loadAnimals();
  }

  private loadHabitats(): void {
    this.habitatService.getHabitats().subscribe({
      next: (habitats) => this.habitats.set(habitats),
      error: (error) =>
        console.error('Erreur lors du chargement des habitats:', error),
    });
  }

  private loadAnimals(): void {
    this.animalService.getAnimals().subscribe({
      next: (animals) => this.animals.set(animals),
      error: (error) =>
        console.error('Erreur lors du chargement des animaux:', error),
    });
  }
}
