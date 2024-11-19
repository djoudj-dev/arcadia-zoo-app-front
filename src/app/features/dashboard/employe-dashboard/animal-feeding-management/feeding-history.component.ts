import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import {
  FeedingHistory,
  FeedingHistoryResponse,
} from './models/feeding-history.model';
import { AnimalFeedingManagementService } from './services/animal-feeding-management.service';

@Component({
  selector: 'app-feeding-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (feedingHistory().length === 0) {
    <div class="text-center py-4 text-gray-500">
      Aucun historique de repas disponible pour cet animal.
    </div>
    } @else {
    <div class="space-y-4">
      @for (history of feedingHistory(); track history.id_feeding) {
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-sm font-medium text-gray-900">
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
        <div class="mt-2 text-sm text-gray-600">"{{ history.notes }}"</div>
        }
      </div>
      }
    </div>
    }
  `,
})
export class FeedingHistoryComponent implements OnInit {
  @Input() animalId!: number;
  @Input() showDirectContent: boolean = false;
  @Input() animalName?: string;

  feedingHistory = signal<FeedingHistory[]>([]);

  constructor(private animalFeeding: AnimalFeedingManagementService) {}

  ngOnInit(): void {
    this.loadFeedingHistory();
  }

  private loadFeedingHistory(): void {
    this.animalFeeding.getFeedingHistory(this.animalId).subscribe({
      next: (historyResponse: FeedingHistoryResponse[]) => {
        const history: FeedingHistory[] = historyResponse.map((response) => ({
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
        }));
        this.feedingHistory.set(history);
      },
      error: (error) =>
        console.error("Erreur lors du chargement de l'historique:", error),
    });
  }
}
