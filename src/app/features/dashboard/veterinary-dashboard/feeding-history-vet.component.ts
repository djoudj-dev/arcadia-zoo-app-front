import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  Input,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { FeedingHistoryResponse } from '../employe-dashboard/animal-feeding-management/models/feeding-history.model';
import { AnimalFeedingManagementService } from '../employe-dashboard/animal-feeding-management/services/animal-feeding-management.service';

@Component({
  selector: 'app-feeding-history-vet',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pr-3 custom-scrollbar max-h-[70vh] overflow-y-auto">
      @if (feedingHistory().length === 0) {
      <div
        class="flex flex-col items-center justify-center py-8 bg-white/80 rounded-xl"
      >
        <p class="text-gray-600 text-lg font-medium">
          Aucun historique disponible pour cet animal.
        </p>
        <p class="text-gray-500 text-sm mt-2">
          Les repas enregistrés apparaîtront ici.
        </p>
      </div>
      } @else {
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        @for (history of feedingHistory(); track history.id_feeding) {
        <div
          class="bg-white/90 rounded-xl p-4 shadow-md border-l-4 border-l-tertiary border border-secondary/10 transition-all duration-200 hover:shadow-lg"
        >
          <div class="flex flex-col gap-3">
            <div class="flex-1 space-y-2">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-medium text-quinary text-lg">
                  {{ history.food_type | titlecase }}
                </h3>
                <span
                  class="bg-tertiary/10 text-tertiary px-3 py-1 rounded-full text-sm font-medium"
                >
                  {{ history.quantity }} {{ history.unit }}
                </span>
              </div>

              <div class="space-y-1">
                <p class="text-sm text-gray-600 flex items-center gap-2">
                  <span class="w-4 h-4 inline-block">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  {{ history.feeding_date | date : 'dd/MM/yyyy HH:mm' }}
                </p>
                <p class="text-sm text-gray-600 flex items-center gap-2">
                  <span class="w-4 h-4 inline-block">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  {{ history.user_name }}
                </p>
              </div>
            </div>
          </div>

          @if (history.notes) {
          <div class="mt-3 pt-3 border-t border-gray-100">
            <p class="text-sm text-gray-600 italic flex items-start gap-2">
              <span class="w-4 h-4 inline-block mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </span>
              "{{ history.notes }}"
            </p>
          </div>
          }
        </div>
        }
      </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: #557a46 #e2e8f0;
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #e2e8f0;
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #557a46;
        border-radius: 10px;
      }
    `,
  ],
})
export class FeedingHistoryVetComponent implements OnInit {
  @Input({ required: true }) animalId!: number;

  private readonly feedingService = inject(AnimalFeedingManagementService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly feedingHistory = signal<FeedingHistoryResponse[]>([]);

  ngOnInit(): void {
    this.loadHistory();
  }

  private async loadHistory(): Promise<void> {
    try {
      const history = await firstValueFrom(
        this.feedingService
          .getFeedingHistory(this.animalId)
          .pipe(takeUntilDestroyed(this.destroyRef))
      );
      this.feedingHistory.set(history);
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error);
      this.feedingHistory.set([]);
    }
  }
}
