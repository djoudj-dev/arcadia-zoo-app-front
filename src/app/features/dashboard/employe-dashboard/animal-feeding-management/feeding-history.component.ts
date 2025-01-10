import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { ModalComponent } from 'app/shared/components/modal/modal.component';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { Subject, takeUntil } from 'rxjs';
import {
  FeedingHistory,
  FeedingHistoryResponse,
} from './models/feeding-history.model';
import { AnimalFeedingManagementService } from './services/animal-feeding-management.service';

@Component({
  selector: 'app-feeding-history',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Bouton pour ouvrir le modal -->
    <app-button
      [text]="'Historique'"
      [type]="'button'"
      [color]="'secondary'"
      [rounded]="true"
      [customClass]="'text-sm px-4 py-2'"
      (click)="isModalOpen.set(true)"
    ></app-button>

    <!-- Modal d'historique -->
    <app-modal [isOpen]="isModalOpen()" (close)="closeModal()">
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <!-- En-tête du modal -->
        <div class="bg-tertiary px-6 py-4">
          <h3 class="text-xl font-serif font-semibold text-white">
            Historique des repas
          </h3>
        </div>

        <!-- Corps du modal avec virtualisation -->
        <div class="p-6 max-h-[70vh] overflow-y-auto">
          @if (isLoading()) {
          <div class="flex justify-center items-center h-48">
            <div
              class="animate-spin rounded-full h-12 w-12 border-4 border-tertiary border-t-transparent"
            ></div>
          </div>
          } @else if (sortedHistory().length === 0) {
          <div class="text-center py-4 text-gray-500">
            Aucun historique de repas disponible pour cet animal.
          </div>
          } @else {
          <div class="space-y-4">
            @for (history of sortedHistory(); track history.id_feeding) {
            <div
              class="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all duration-300"
            >
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-sm font-medium text-tertiary">
                    {{ history.food_type }}
                  </div>
                  <div class="text-sm text-gray-500">
                    Quantité: {{ history.quantity }} {{ history.unit }}
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm text-gray-500">
                    {{ history.feeding_date | date : 'dd/MM/yyyy à HH:mm' }}
                  </div>
                  <div class="text-xs text-gray-400">
                    Par: {{ history.user_name }}
                  </div>
                </div>
              </div>
              @if (history.notes) {
              <div class="mt-2 text-sm text-gray-600 italic">
                "{{ history.notes }}"
              </div>
              }
            </div>
            }
          </div>
          }
        </div>

        <!-- Pied du modal -->
        <div class="bg-gray-50 px-6 py-4 flex justify-end">
          <app-button
            [text]="'Fermer'"
            [type]="'button'"
            [color]="'secondary'"
            [rounded]="true"
            [customClass]="'px-6'"
            (click)="closeModal()"
          ></app-button>
        </div>
      </div>
    </app-modal>
  `,
})
export class FeedingHistoryComponent implements OnInit, OnDestroy {
  @Input() animalId!: number;
  @Input() animalName?: string;

  private readonly destroy$ = new Subject<void>();

  // Signaux
  feedingHistory = signal<FeedingHistory[]>([]);
  isModalOpen = signal<boolean>(false);
  isLoading = signal<boolean>(true);

  // Computed pour trier l'historique
  sortedHistory = computed(() =>
    [...this.feedingHistory()].sort(
      (a, b) =>
        new Date(b.feeding_date).getTime() - new Date(a.feeding_date).getTime()
    )
  );

  private readonly animalFeeding = inject(AnimalFeedingManagementService);
  private readonly toastService = inject(ToastService);

  ngOnInit(): void {
    this.loadFeedingHistory();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadFeedingHistory(): void {
    this.isLoading.set(true);

    this.animalFeeding
      .getFeedingHistory(this.animalId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (historyResponse: FeedingHistoryResponse[]) => {
          const history: FeedingHistory[] = historyResponse.map(
            this.mapHistoryResponse
          );
          this.feedingHistory.set(history);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error("Erreur lors du chargement de l'historique:", error);
          this.toastService.showError(
            "Erreur lors du chargement de l'historique"
          );
          this.isLoading.set(false);
        },
      });
  }

  private mapHistoryResponse(response: FeedingHistoryResponse): FeedingHistory {
    return {
      _id: response._id,
      id_feeding: response.id_feeding,
      animal_id: response.animal_id,
      feeding_date: response.feeding_date,
      food_type: response.food_type,
      quantity: response.quantity,
      unit: response.unit,
      notes: response.notes,
      user_name: response.user_name,
      status: response.status,
      created_at: response.created_at,
      updated_at: response.updated_at,
    };
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }
}
