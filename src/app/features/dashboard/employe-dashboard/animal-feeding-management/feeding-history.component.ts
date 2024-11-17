import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { ModalComponent } from 'app/shared/components/modal/modal.component';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import {
  FeedingHistory,
  FeedingHistoryResponse,
} from './models/feeding-history.model';
import { AnimalFeedingManagementService } from './services/animal-feeding-management.service';
@Component({
  selector: 'app-feeding-history',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  template: `
    <button
      (click)="showHistory()"
      class="text-sm text-tertiary hover:text-quaternary transition-colors duration-200"
    >
      Voir l'historique
    </button>

    <app-modal [isOpen]="isModalOpen()" (close)="closeModal()">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-3xl w-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-tertiary">Historique des repas</h2>
          <button
            (click)="closeModal()"
            class="text-gray-500 hover:text-gray-700"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        @if (isLoading()) {
        <div class="flex justify-center py-8">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-tertiary"
          ></div>
        </div>
        } @else if (history().length === 0) {
        <p class="text-center text-gray-500 py-8">
          Aucun historique disponible pour cet animal.
        </p>
        } @else {
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Date
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Employé
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Type
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Quantité
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Notes
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (item of history(); track item.id) {
              <tr>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  {{ formatDate(item.feedingTime) }}
                </td>
                <td class="px-4 py-3 text-sm">
                  {{ item.employeName }}
                </td>
                <td class="px-4 py-3 text-sm">
                  {{ item.foodType }}
                </td>
                <td class="px-4 py-3 text-sm">
                  {{ item.quantity.toFixed(1) }}kg
                </td>
                <td class="px-4 py-3 text-sm">
                  {{ item.notes || '-' }}
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
        }
      </div>
    </app-modal>
  `,
})
export class FeedingHistoryComponent implements OnInit {
  @Input() animalId!: number;

  isModalOpen = signal(false);
  isLoading = signal(false);
  history = signal<FeedingHistory[]>([]);

  constructor(
    private feedingService: AnimalFeedingManagementService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Pas besoin de charger l'historique au démarrage
  }

  showHistory() {
    this.isModalOpen.set(true);
    this.loadHistory();
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  private loadHistory() {
    this.isLoading.set(true);
    this.feedingService.getFeedingHistory(this.animalId).subscribe({
      next: (data: FeedingHistoryResponse[]) => {
        const processedData = data.map((item) => {
          const feedingHistory: FeedingHistory = {
            id: item.id_feeding || 0,
            animalId: item.animal_id || 0,
            employeId: item.employee_id || 0,
            employeName: item.employee_name || 'Employé inconnu',
            feedingTime: item.feeding_date,
            foodType: item.food_type || 'Nourriture standard',
            quantity: typeof item.quantity === 'number' ? item.quantity : 0,
            notes: item.notes || '',
          };

          return feedingHistory;
        });

        const sortedData = processedData.sort(
          (a, b) =>
            new Date(b.feedingTime).getTime() -
            new Date(a.feedingTime).getTime()
        );

        this.history.set(sortedData);
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

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'Date non disponible';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date non disponible';

      return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Date non disponible';
    }
  }

  getDefaultDate(): Date {
    return new Date();
  }
}
