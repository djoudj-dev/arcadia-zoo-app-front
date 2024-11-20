import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { ModalComponent } from 'app/shared/components/modal/modal.component';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { ToastComponent } from 'app/shared/components/toast/toast.component';
import {
  finalize,
  firstValueFrom,
  forkJoin,
  map,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { Habitat } from '../../../habitats/models/habitat.model';
import { HabitatService } from '../../../habitats/service/habitat.service';
import { User } from '../../admin-dashboard/account-management/model/user.model';
import { Animal } from '../../admin-dashboard/animal-management/model/animal.model';
import { FeedingHistoryComponent } from './feeding-history.component';
import { FeedingData } from './models/feeding-data.model';
import { AnimalFeedingManagementService } from './services/animal-feeding-management.service';

/**
 * Composant de gestion de l'alimentation des animaux
 * Permet d'enregistrer les repas et de consulter l'historique
 */
@Component({
  selector: 'app-animal-feeding-management',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    FormsModule,
    ToastComponent,
    FeedingHistoryComponent,
    ButtonComponent,
  ],
  templateUrl: './animal-feeding-management.component.html',
})
export class FeedingDataComponent implements OnInit, OnDestroy {
  /** Signaux pour la gestion d'état réactive */
  public readonly habitats = signal<Habitat[]>([]);
  public readonly animals = signal<Animal[]>([]);
  public readonly isLoading = signal<boolean>(false);
  public readonly error = signal<string | null>(null);
  public readonly feedingInProgress = signal<Set<number>>(new Set());
  public readonly modalToastVisible = signal(false);
  public readonly isModalOpen = signal<boolean>(false);
  public readonly selectedAnimalId = signal<number | null>(null);
  public readonly activeToasts = signal<Set<number>>(new Set());

  /** Données du formulaire de repas */
  feedingData: FeedingData = {
    feedingTime: new Date(),
    foodType: '',
    quantity: 0,
    animalId: 0,
    employeId: 0,
    employeName: '',
    notes: '',
  };

  /** Subject pour la gestion de la destruction */
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly habitatService: HabitatService,
    private readonly animalFeedingService: AnimalFeedingManagementService,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadHabitats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Marque un animal comme nourri
   * @param animalId ID de l'animal
   * @returns Promise<void>
   */
  public async markAsFed(animalId: number): Promise<void> {
    if (this.feedingInProgress().has(animalId)) {
      this.toastService.showError('Opération déjà en cours');
      return;
    }

    const currentUser = this.authService.currentUserSignal();
    if (!currentUser?.id) {
      this.toastService.showError('ID utilisateur non disponible');
      return;
    }

    const feedingDataToSend = this.prepareFeedingData(animalId, currentUser);
    this.updateFeedingProgress(animalId, true);

    try {
      await firstValueFrom(
        this.animalFeedingService
          .markAnimalAsFed(animalId, feedingDataToSend)
          .pipe(
            takeUntil(this.destroy$),
            finalize(() => this.updateFeedingProgress(animalId, false))
          )
      );

      this.toastService.showSuccess('Animal nourri avec succès');
      this.habitatService.clearCache();
      this.loadHabitats();
      this.showToastForAnimal(animalId);
    } catch (error) {
      console.error('Erreur complète:', error);
      this.toastService.showError(
        "Erreur lors du marquage de l'animal comme nourri"
      );
    }
  }

  /**
   * Charge les habitats et leurs animaux
   */
  private loadHabitats(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.habitatService
      .getHabitats()
      .pipe(
        switchMap((habitats) =>
          forkJoin(
            habitats.map((habitat) =>
              this.habitatService
                .getAnimalsByHabitatId(habitat.id_habitat)
                .pipe(
                  map((animals) => ({
                    ...habitat,
                    animals,
                  }))
                )
            )
          )
        ),
        takeUntil(this.destroy$),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (habitatsWithAnimals) => {
          this.habitats.set(habitatsWithAnimals);
        },
        error: () => {
          this.error.set('Erreur lors du chargement des habitats');
          this.toastService.showError('Erreur lors du chargement des habitats');
        },
      });
  }

  /**
   * Ouvre le modal d'alimentation pour un animal
   * @param animalId ID de l'animal
   */
  openFeedingModal(animalId: number): void {
    if (!animalId) {
      this.toastService.showError('ID animal invalide');
      return;
    }

    this.selectedAnimalId.set(animalId);
    this.feedingData.animalId = animalId;
    this.isModalOpen.set(true);
  }

  /**
   * Gère l'enregistrement d'un repas
   */
  async handleFeedingSave() {
    if (!this.validateFeedingData()) {
      this.toastService.showError(
        'Veuillez remplir tous les champs correctement'
      );
      return;
    }

    try {
      await this.markAsFed(this.feedingData.animalId);
      this.modalToastVisible.set(true);
      this.resetFeedingData();

      setTimeout(() => {
        this.modalToastVisible.set(false);
        this.isModalOpen.set(false);
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      this.toastService.showError(
        "Erreur lors de l'enregistrement de la consommation"
      );
    }
  }

  /**
   * Ferme le modal d'alimentation
   */
  closeModal(): void {
    this.isModalOpen.set(false);
    this.modalToastVisible.set(false);
  }

  /**
   * Navigation vers la page d'accueil
   */
  goBack() {
    this.router.navigate(['/']);
  }

  /**
   * Prépare les données d'alimentation pour l'envoi
   */
  private prepareFeedingData(animalId: number, currentUser: User): FeedingData {
    return {
      feedingTime: new Date(),
      animalId: animalId,
      employeId: currentUser.id,
      employeName: currentUser.name || 'Employé inconnu',
      user_id: currentUser.id,
      user_name: currentUser.name || 'Employé inconnu',
      foodType: this.feedingData.foodType,
      quantity: this.feedingData.quantity,
      notes: this.feedingData.notes || '',
    };
  }

  /**
   * Met à jour l'état de progression de l'alimentation
   */
  private updateFeedingProgress(animalId: number, inProgress: boolean): void {
    const updatedFeeding = new Set(this.feedingInProgress());
    if (inProgress) {
      updatedFeeding.add(animalId);
    } else {
      updatedFeeding.delete(animalId);
    }
    this.feedingInProgress.set(updatedFeeding);
  }

  /**
   * Valide les données du formulaire d'alimentation
   */
  private validateFeedingData(): boolean {
    return !!(
      this.feedingData.animalId &&
      this.feedingData.foodType &&
      this.feedingData.quantity > 0
    );
  }

  /**
   * Réinitialise le formulaire d'alimentation
   */
  private resetFeedingData(): void {
    this.feedingData = {
      feedingTime: new Date(),
      foodType: '',
      quantity: 0,
      animalId: 0,
      employeId: 0,
      employeName: '',
      notes: '',
    };
  }

  /**
   * Affiche un toast pour un animal spécifique
   * @param animalId ID de l'animal
   */
  private showToastForAnimal(animalId: number): void {
    this.activeToasts.update((toasts) => {
      const newToasts = new Set(toasts);
      newToasts.add(animalId);
      return newToasts;
    });

    setTimeout(() => {
      this.activeToasts.update((toasts) => {
        const newToasts = new Set(toasts);
        newToasts.delete(animalId);
        return newToasts;
      });
    }, 3000);
  }
}
