import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { AnimalService } from '../../animal/service/animal.service';
import { HabitatService } from '../../habitats/service/habitat.service';
import { Animal } from '../admin-dashboard/animal-management/model/animal.model';
import { Habitat } from '../admin-dashboard/habitat-management/model/habitat.model';
import { FeedingHistoryComponent } from '../employe-dashboard/animal-feeding-management/feeding-history.component';
import { FeedingHistoryVetComponent } from './feeding-history-vet.component';

@Component({
  selector: 'app-veterinary-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    ModalComponent,
    FeedingHistoryComponent,
    FeedingHistoryVetComponent,
  ],
  templateUrl: './veterinary-dashboard.component.html',
})
export class VeterinaryDashboardComponent implements OnInit {
  habitats = signal<Habitat[]>([]);
  animals = signal<Animal[]>([]);
  activeTab = signal<'overview' | 'history'>('overview');
  selectedAnimalId = signal<number | null>(null);
  isModalOpen = signal(false);

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

  selectAnimal(animalId: number): void {
    this.selectedAnimalId.set(animalId);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }
}
