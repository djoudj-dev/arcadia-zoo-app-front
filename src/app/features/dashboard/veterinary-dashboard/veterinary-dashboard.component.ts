import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { AnimalService } from '../../animal/service/animal.service';
import { HabitatService } from '../../habitats/service/habitat.service';
import { Animal } from '../admin-dashboard/animal-management/model/animal.model';
import { Habitat } from '../admin-dashboard/habitat-management/model/habitat.model';
import { FeedingHistoryVetComponent } from './feeding-history-vet.component';
import { HabitatCommentComponent } from './habitat-comment/habitat-comment/habitat-comment.component';
import { HabitatComment } from './habitat-comment/habitat-comment/model/habitat-comment.model';
import { HabitatCommentService } from './habitat-comment/habitat-comment/service/habitat-comment.service';

@Component({
  selector: 'app-veterinary-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    ModalComponent,
    FeedingHistoryVetComponent,
    HabitatCommentComponent,
  ],
  templateUrl: './veterinary-dashboard.component.html',
})
export class VeterinaryDashboardComponent implements OnInit {
  habitats = signal<Habitat[]>([]);
  animals = signal<Animal[]>([]);
  activeTab = signal<'overview' | 'history'>('overview');
  selectedAnimalId = signal<number | null>(null);
  selectedHabitatId = signal<number | null>(null);
  private _isHistoryModalOpen = signal(false);
  private _isHabitatModalOpen = signal(false);
  private _isHabitatHistoryModalOpen = signal(false);
  habitatComments = signal<HabitatComment[]>([]);

  constructor(
    private habitatService: HabitatService,
    private animalService: AnimalService,
    private habitatCommentService: HabitatCommentService
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
    this._isHistoryModalOpen.set(true);
  }

  selectHabitat(habitatId: number): void {
    this.selectedHabitatId.set(habitatId);
    this._isHabitatModalOpen.set(true);
  }

  closeHistoryModal() {
    this._isHistoryModalOpen.set(false);
    this.selectedAnimalId.set(null);
  }

  closeHabitatModal() {
    this._isHabitatModalOpen.set(false);
    this.selectedHabitatId.set(null);
  }

  viewHabitatComments(habitatId: number) {
    this.selectedHabitatId.set(habitatId);
    this.loadHabitatComments(habitatId);
    this._isHabitatHistoryModalOpen.set(true);
  }

  private loadHabitatComments(habitatId: number): void {
    this.habitatCommentService.getCommentsByHabitatId(habitatId).subscribe({
      next: (comments) => {
        this.habitatComments.set(comments);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des commentaires:', error);
      },
    });
  }

  closeHabitatHistoryModal() {
    this._isHabitatHistoryModalOpen.set(false);
    this.selectedHabitatId.set(null);
    this.habitatComments.set([]);
  }

  generateReport(animalId: number): void {
    console.log(`Génération du rapport pour l'animal ${animalId}`);
    // Implémentez ici la logique pour générer le rapport
  }

  getHabitatName(habitatId: number): string {
    const habitat = this.habitats().find((h) => h.id_habitat === habitatId);
    return habitat ? habitat.name : 'Non assigné';
  }

  openFeedingHistory(animalId: number): void {
    this.selectedAnimalId.set(animalId);
    this._isHistoryModalOpen.set(true);
  }

  isHistoryModalOpen = computed(() => this._isHistoryModalOpen());
  isHabitatModalOpen = computed(() => this._isHabitatModalOpen());
  isHabitatHistoryModalOpen = computed(() => this._isHabitatHistoryModalOpen());

  getSelectedHabitat() {
    return this.habitats().find(
      (h) => h.id_habitat === this.selectedHabitatId()
    );
  }
}
