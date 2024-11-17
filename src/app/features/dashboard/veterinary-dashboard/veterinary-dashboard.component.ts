import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { AnimalService } from '../../animal/service/animal.service';
import { HabitatService } from '../../habitats/service/habitat.service';
import { Animal } from '../admin-dashboard/animal-management/model/animal.model';
import { Habitat } from '../admin-dashboard/habitat-management/model/habitat.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { VeterinaryFeedingHistoryComponent } from './feeding-history/feeding-history.component';

@Component({
  selector: 'app-veterinary-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonComponent, VeterinaryFeedingHistoryComponent],
  templateUrl: './veterinary-dashboard.component.html',
})
export class VeterinaryDashboardComponent implements OnInit {
  habitats = signal<Habitat[]>([]);
  animals = signal<Animal[]>([]);
  activeTab = signal<'overview' | 'history'>('overview');

  constructor(
    private habitatService: HabitatService,
    private animalService: AnimalService
  ) {}

  ngOnInit(): void {
    this.loadHabitats();
    this.loadAnimals();
  }

  setActiveTab(tab: 'overview' | 'history'): void {
    this.activeTab.set(tab);
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
