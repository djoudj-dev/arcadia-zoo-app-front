import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { AnimalService } from '../../animal/service/animal.service';
import { HabitatService } from '../../habitats/service/habitat.service';
import { Animal } from '../admin-dashboard/animal-management/model/animal.model';
import { Habitat } from '../admin-dashboard/habitat-management/model/habitat.model';
import { AnimalFeedingManagementService } from '../employe-dashboard/animal-feeding-management/services/animal-feeding-management.service';
import { FeedingHistoryVetComponent } from './feeding-history-vet.component';
import { HabitatCommentHistoryComponent } from './habitat-comment/habitat-comment-history/habitat-comment-history.component';
import { HabitatCommentComponent } from './habitat-comment/habitat-comment/habitat-comment.component';
import { HabitatComment } from './habitat-comment/habitat-comment/model/habitat-comment.model';
import { HabitatCommentService } from './habitat-comment/habitat-comment/service/habitat-comment.service';
import { VeterinaryReportsComponent } from './veterinary-reports/veterinary-reports.component';

@Component({
  selector: 'app-veterinary-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    FeedingHistoryVetComponent,
    HabitatCommentComponent,
    ButtonComponent,
    HabitatCommentHistoryComponent,
    VeterinaryReportsComponent,
  ],
  templateUrl: './veterinary-dashboard.component.html',
})
export class VeterinaryDashboardComponent implements OnInit {
  habitats = signal<Habitat[]>([]);
  animals = signal<Animal[]>([]);
  activeTab = signal<'overview' | 'history'>('overview');
  selectedAnimalId = signal<number | null>(null);
  selectedHabitatId = signal<number | null>(null);
  private readonly _isHistoryModalOpen = signal(false);
  private readonly _isHabitatModalOpen = signal(false);
  private readonly _isHabitatHistoryModalOpen = signal(false);
  habitatComments = signal<HabitatComment[]>([]);
  activeHistoryTab: 'meals' | 'habitats' | 'consultations' = 'meals';
  habitatCommentsMap = signal<Map<number, HabitatComment[]>>(new Map());
  private readonly _isReportModalOpen = signal(false);
  private readonly _showVetReports = signal(false);
  readonly showVetReports = computed(() => this._showVetReports());
  readonly hasHistory = signal(false);

  constructor(
    private readonly habitatService: HabitatService,
    private readonly animalService: AnimalService,
    private readonly habitatCommentService: HabitatCommentService,
    private readonly animalFeedingService: AnimalFeedingManagementService
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
    this._showVetReports.set(false);
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
        const currentMap = new Map(this.habitatCommentsMap());
        currentMap.set(habitatId, comments);
        this.habitatCommentsMap.set(currentMap);
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

  openReportForm(animalId: number): void {
    this.selectedAnimalId.set(animalId);
    this._isReportModalOpen.set(true);
  }

  closeReportModal() {
    this._isReportModalOpen.set(false);
    this.selectedAnimalId.set(null);
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
  isReportModalOpen = computed(() => this._isReportModalOpen());

  getSelectedHabitat() {
    return this.habitats().find(
      (h) => h.id_habitat === this.selectedHabitatId()
    );
  }

  setActiveHistoryTab(tab: 'meals' | 'habitats' | 'consultations') {
    this.activeHistoryTab = tab;
    if (tab === 'habitats') {
      this.habitats().forEach((habitat) => {
        this.loadHabitatComments(habitat.id_habitat);
      });
    }
  }

  viewConsultations(animalId: number) {
    console.log("Voir les consultations pour l'animal:", animalId);
  }

  getHabitatComments(habitatId: number): HabitatComment[] {
    return this.habitatCommentsMap().get(habitatId) || [];
  }

  toggleHistoryView(showReports: boolean) {
    this._showVetReports.set(showReports);
  }

  openVetReportsHistory(animalId: number): void {
    this.selectedAnimalId.set(animalId);
    this._isHistoryModalOpen.set(true);
    this._showVetReports.set(true);
  }

  loadFeedingHistory(animalId: number) {
    this.animalFeedingService.getFeedingHistory(animalId).subscribe({
      next: (history) => {
        this.hasHistory.set(history.length > 0);
      },
      error: (error) => {
        console.error("Erreur lors du chargement de l'historique:", error);
      },
    });
  }

  getAnimals() {
    return this.animalService.getAnimals();
  }
}
