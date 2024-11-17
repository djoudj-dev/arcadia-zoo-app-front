import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AnimalService } from 'app/features/animal/service/animal.service';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { Animal } from '../../admin-dashboard/animal-management/model/animal.model';
import { FeedingHistoryResponse } from '../../employe-dashboard/animal-feeding-management/models/feeding-history.model';
import { AnimalFeedingManagementService } from '../../employe-dashboard/animal-feeding-management/services/animal-feeding-management.service';

@Component({
  selector: 'app-veterinary-feeding-history',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent],
  template: `
    <h1 class="text-2xl font-bold text-tertiary mb-6">Historique des repas</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      @for (animal of animals(); track animal.id_animal) {
      <div
        class="bg-white/80 rounded-lg p-4 shadow-sm border border-secondary/10 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center gap-4 mb-4">
          <img
            [src]="animal.images"
            [alt]="animal.name"
            class="w-16 h-16 rounded-full object-cover border-2 border-tertiary shadow-md"
          />
          <h2 class="text-xl font-bold text-tertiary">{{ animal.name }}</h2>
        </div>

        <button
          (click)="openModal(animal.id_animal)"
          class="text-sm text-tertiary hover:text-primary transition-colors duration-300 underline decoration-dotted"
        >
          Voir l'historique
        </button>
      </div>
      }
    </div>

    <app-modal [isOpen]="isModalOpen()" (close)="closeModal()">
      <div
        class="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-xl"
      >
        <h2
          class="text-xl sm:text-2xl font-bold text-tertiary mb-6 text-center drop-shadow-sm"
        >
          Historique des repas
        </h2>

        @if (feedingHistory().length === 0) {
        <p class="text-center text-gray-600">
          Aucun historique disponible pour cet animal.
        </p>
        } @else {
        <div
          class="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar"
        >
          @for (history of feedingHistory(); track history.id_feeding) {
          <div
            class="bg-white/80 rounded-lg p-4 shadow-sm border border-secondary/10 hover:shadow-md transition-shadow"
          >
            <div
              class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4"
            >
              <div class="flex-1">
                <p class="font-medium text-quinary text-lg">
                  {{ history.food_type | titlecase }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ history.feeding_date | date : 'dd/MM/yyyy HH:mm' }}
                </p>
                <p class="text-sm text-gray-500">
                  Donné par: {{ history.employee_name }}
                </p>
              </div>
              <span
                class="bg-tertiary/10 text-tertiary px-4 py-2 rounded-full text-sm font-medium self-start sm:self-center whitespace-nowrap"
              >
                {{ history.quantity }} {{ history.unit }}
              </span>
            </div>
            @if (history.notes) {
            <div class="mt-3 pt-3 border-t border-gray-100">
              <p class="text-sm text-gray-600 italic">"{{ history.notes }}"</p>
            </div>
            }
          </div>
          }
        </div>
        }

        <div class="flex justify-center mt-6">
          <app-button
            [text]="'Fermer'"
            [type]="'button'"
            [color]="'secondary'"
            [rounded]="true"
            class="w-32 shadow-sm hover:shadow-md transition-all duration-300"
            (click)="closeModal()"
          />
        </div>
      </div>
    </app-modal>
  `,
})
export class VeterinaryFeedingHistoryComponent implements OnInit {
  private readonly animalService = inject(AnimalService);
  private readonly feedingService = inject(AnimalFeedingManagementService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly environment = environment;
  protected readonly animals = signal<Animal[]>([]);
  protected readonly feedingHistory = signal<FeedingHistoryResponse[]>([]);
  protected readonly isModalOpen = signal(false);

  ngOnInit(): void {
    this.loadAnimals();
  }

  private loadAnimals(): void {
    this.animalService
      .getAnimals()
      .pipe(
        map((animals) =>
          animals.map((animal) => ({
            ...animal,
            images: animal.images || null,
          }))
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (animals) => this.animals.set(animals),
        error: (error) =>
          console.error('Erreur lors du chargement des animaux:', error),
      });
  }

  async openModal(animalId: number): Promise<void> {
    try {
      const history = await firstValueFrom(
        this.feedingService
          .getFeedingHistory(animalId)
          .pipe(takeUntilDestroyed(this.destroyRef))
      );
      this.feedingHistory.set(history);
      this.isModalOpen.set(true);
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error);
      this.feedingHistory.set([]);
    }
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }
}
