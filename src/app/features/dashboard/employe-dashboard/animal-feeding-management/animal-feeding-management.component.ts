import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { ModalComponent } from 'app/shared/components/modal/modal.component';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { ToastComponent } from 'app/shared/components/toast/toast.component';
import { finalize, forkJoin, map, Subject, switchMap, takeUntil } from 'rxjs';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
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
    ButtonComponent,
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

  public markAsFed(animalId: number): void {
    if (this.feedingInProgress().has(animalId)) {
      return;
    }

    const currentUser = this.authService.currentUserSignal();
    if (!currentUser?.id) {
      this.toastService.showError('Erreur : ID utilisateur non disponible');
      return;
    }

    // Récupération du nom complet
    const userName = currentUser.name
      ? `${currentUser.name}`
      : currentUser.name || 'Employé inconnu';

    const feedingDataToSend: FeedingData = {
      ...this.feedingData,
      feedingTime: new Date(),
      animalId: animalId,
      employeId: currentUser.id,
      employeName: userName.trim(), // Utilisation du nom complet
      foodType: 'Nourriture standard',
      quantity: this.feedingData.quantity || 0,
    };

    console.log('Données de nourrissage à envoyer:', feedingDataToSend);

    this.animalFeedingService
      .markAnimalAsFed(animalId, feedingDataToSend)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
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
        },
        error: (error) => {
          console.error('Erreur complète:', error);
          let errorMessage =
            "Erreur lors du marquage de l'animal comme nourri.";
          this.error.set(errorMessage);
          this.showToastForAnimal(animalId);
        },
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
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (habitatsWithAnimals) => {
          this.habitats.set(habitatsWithAnimals);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.error.set('Erreur lors du chargement des habitats');
          this.isLoading.set(false);
          console.error('Erreur lors du chargement des habitats:', error);
        },
      });
  }

  openFeedingModal(animalId: number): void {
    this.selectedAnimalId.set(animalId);
    this.feedingData.animalId = animalId;
    this.isModalOpen.set(true);
  }

  handleFeedingSave(): void {
    if (
      !this.feedingData.animalId ||
      !this.feedingData.foodType ||
      this.feedingData.quantity <= 0
    ) {
      this.error.set('Veuillez remplir tous les champs correctement');
      return;
    }

    try {
      this.markAsFed(this.feedingData.animalId);
      this.isModalOpen.set(false);
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
    } catch (error) {
      this.error.set("Une erreur est survenue lors de l'enregistrement");
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
