import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { FeedingHistoryResponse } from './models/feeding-history.model';
import { AnimalFeedingManagementService } from './services/animal-feeding-management.service';

@Component({
  selector: 'app-feeding-history',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent],
  template: `
    <!-- Bouton pour ouvrir le modal -->
    <button
      (click)="openModal()"
      class="text-sm text-tertiary hover:text-primary transition-colors duration-300 underline decoration-dotted"
    >
      Voir l'historique
    </button>

    <!-- Modal avec contenu dynamique -->
    <app-modal [isOpen]="isModalOpen()" (close)="closeModal()">
      <div
        class="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-xl"
      >
        <h2
          class="text-xl sm:text-2xl font-bold text-tertiary mb-6 text-center drop-shadow-sm"
        >
          Historique des repas
        </h2>

        <!-- Gestion des cas où il n'y a pas d'historique -->
        @if (feedingHistory().length === 0) {
        <p class="text-center text-gray-600">
          Aucun historique disponible pour cet animal.
        </p>
        } @else {
        <div
          class="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar"
        >
          <!-- Liste de l'historique -->
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
            <!-- Notes éventuelles -->
            @if (history.notes) {
            <div class="mt-3 pt-3 border-t border-gray-100">
              <p class="text-sm text-gray-600 italic">"{{ history.notes }}"</p>
            </div>
            }
          </div>
          }
        </div>
        }

        <!-- Bouton pour fermer le modal -->
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
  styles: [
    `
      :host {
        display: contents;
      }

      .modal-container {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }
    `,
  ],
})
export class FeedingHistoryComponent {
  @Input({ required: true }) animalId!: number;

  private readonly feedingService = inject(AnimalFeedingManagementService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isModalOpen = signal(false);
  protected readonly feedingHistory = signal<FeedingHistoryResponse[]>([]);

  /**
   * Ouvre le modal et charge les données de l'historique
   */
  async openModal(): Promise<void> {
    try {
      const history = await firstValueFrom(
        this.feedingService
          .getFeedingHistory(this.animalId)
          .pipe(takeUntilDestroyed(this.destroyRef))
      );
      this.feedingHistory.set(history);
      this.isModalOpen.set(true);
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error);
      this.feedingHistory.set([]);
    }
  }

  /**
   * Ferme le modal
   */
  closeModal(): void {
    this.isModalOpen.set(false);
  }
}
