import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { ModalComponent } from 'app/shared/components/modal/modal.component';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { ToastComponent } from 'app/shared/components/toast/toast.component';
import { finalize, forkJoin, map, Subject, switchMap, takeUntil } from 'rxjs';
import { Habitat } from '../../../habitats/models/habitat.model';
import { HabitatService } from '../../../habitats/service/habitat.service';
import { Animal } from '../../admin-dashboard/animal-management/model/animal.model';
import { FeedingHistoryComponent } from './feeding-history.component';
import { FeedingData } from './models/feeding-data.model';
import { AnimalFeedingManagementService } from './services/animal-feeding-management.service';

@Component({
  selector: 'app-animal-feeding-management',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    FormsModule,
    ToastComponent,
    FeedingHistoryComponent,
  ],
  templateUrl: './animal-feeding-management.component.html',
})
export class FeedingDataComponent implements OnInit, OnDestroy {
  // Signaux publics
  public readonly habitats = signal<Habitat[]>([]);
  public readonly animals = signal<Animal[]>([]);
  public readonly isLoading = signal<boolean>(false);
  public readonly error = signal<string | null>(null);
  public readonly activeToasts = signal<Set<number>>(new Set());

  isModalOpen = signal<boolean>(false);
  selectedAnimalId = signal<number | null>(null);
  feedingData: FeedingData = {
    feedingTime: new Date(),
    foodType: '',
    quantity: 0,
    animalId: 0,
    employeId: 0,
    employeName: '',
    notes: '',
  };

  // Subject pour la gestion de la destruction
  private readonly destroy$ = new Subject<void>();

  // Ajouter une nouvelle propriété pour gérer l'état du chargement par animal
  public feedingInProgress = signal<Set<number>>(new Set());

  modalToastVisible = signal(false);

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

  // Méthode pour afficher un toast pour un animal spécifique
  private showToastForAnimal(animalId: number) {
    // Ajouter l'ID de l'animal aux toasts actifs
    this.activeToasts.update((toasts) => {
      const newToasts = new Set(toasts);
      newToasts.add(animalId);
      return newToasts;
    });

    // Retirer le toast après 3 secondes
    setTimeout(() => {
      this.activeToasts.update((toasts) => {
        const newToasts = new Set(toasts);
        newToasts.delete(animalId);
        return newToasts;
      });
    }, 3000);
  }

  public markAsFed(animalId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.feedingInProgress().has(animalId)) {
        reject('Opération déjà en cours');
        return;
      }

      const currentUser = this.authService.currentUserSignal();
      if (!currentUser?.id) {
        reject('ID utilisateur non disponible');
        return;
      }

      const feedingDataToSend: FeedingData = {
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

      // Ajout de l'animal à la liste des opérations en cours
      const updatedFeeding = new Set(this.feedingInProgress());
      updatedFeeding.add(animalId);
      this.feedingInProgress.set(updatedFeeding);

      this.animalFeedingService
        .markAnimalAsFed(animalId, feedingDataToSend)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => {
            // Retrait de l'animal de la liste des opérations en cours
            const updatedFeeding = new Set(this.feedingInProgress());
            updatedFeeding.delete(animalId);
            this.feedingInProgress.set(updatedFeeding);
          })
        )
        .subscribe({
          next: () => {
            this.showToastForAnimal(animalId);
            this.habitatService.clearCache();
            this.loadHabitats();
            resolve();
          },
          error: (error) => {
            console.error('Erreur complète:', error);
            const errorMessage =
              "Erreur lors du marquage de l'animal comme nourri.";
            this.error.set(errorMessage);
            reject(error);
          },
        });
    });
  }

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
        next: (habitatsWithAnimals) => this.habitats.set(habitatsWithAnimals),
        error: () => this.error.set('Erreur lors du chargement des habitats'),
      });
  }

  openFeedingModal(animalId: number): void {
    // Validez l'animalId avant d'ouvrir le modal
    if (!animalId) {
      console.error('animalId invalide:', animalId);
      return;
    }

    this.selectedAnimalId.set(animalId); // Associez l'animal au modal
    this.feedingData.animalId = animalId; // Mettez à jour feedingData
    this.isModalOpen.set(true); // Ouvrez le modal
  }

  async handleFeedingSave() {
    if (
      !this.feedingData.animalId ||
      !this.feedingData.foodType ||
      this.feedingData.quantity <= 0
    ) {
      this.error.set('Veuillez remplir tous les champs correctement');
      return;
    }

    try {
      // Appeler markAsFed d'abord
      await this.markAsFed(this.feedingData.animalId);

      // Activer le toast modal
      this.modalToastVisible.set(true);

      // Réinitialiser les données du formulaire
      this.feedingData = {
        feedingTime: new Date(),
        foodType: '',
        quantity: 0,
        animalId: 0,
        employeId: 0,
        employeName: '',
        notes: '',
      };

      // Attendre 3 secondes avant de fermer
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

  closeModal(): void {
    this.isModalOpen.set(false);
    this.modalToastVisible.set(false);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
