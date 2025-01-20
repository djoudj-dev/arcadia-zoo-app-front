import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { HabitatComment } from '../habitat-comment/model/habitat-comment.model';
import { HabitatCommentService } from '../habitat-comment/service/habitat-comment.service';

@Component({
  selector: 'app-habitat-comment-history',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div
      class="w-full max-w-6xl mx-auto bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-xl"
    >
      <div class="flex items-center gap-4 mb-8">
        <img
          [src]="habitatImage"
          [alt]="habitatName"
          class="w-24 h-24 rounded-xl object-cover shadow-md"
        />
        <div>
          <h2 class="text-2xl sm:text-3xl font-serif font-bold text-tertiary">
            Historique des commentaires sur les habitats
          </h2>
          <p class="text-lg text-quinary/70 font-medium">
            {{ habitatName }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @if (comments().length === 0) {
        <p class="col-span-full text-center text-tertiary/70 py-8">
          Aucun commentaire pour cet habitat.
        </p>
        } @else { @for (comment of comments(); track comment.id_habitat) {
        <div
          class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 relative overflow-hidden"
        >
          <div
            class="absolute top-0 left-0 right-0 h-1"
            [ngClass]="{
              'bg-green-500': comment.habitat_status === 'Optimal',
              'bg-yellow-500': comment.habitat_status === 'Acceptable',
              'bg-red-500':
                comment.habitat_status === 'Nécessite des améliorations'
            }"
          ></div>

          <div class="flex justify-between items-start mt-2">
            <div class="flex items-center gap-2">
              <div class="text-sm text-tertiary/80 font-medium">
                {{ comment.createdAt | date : 'dd/MM/yyyy à HH:mm' }}
              </div>
            </div>
            <div class="flex flex-col items-end gap-2">
              <div
                class="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                [ngClass]="{
                  'bg-green-100 text-green-800':
                    comment.habitat_status === 'Optimal',
                  'bg-yellow-100 text-yellow-800':
                    comment.habitat_status === 'Acceptable',
                  'bg-red-100 text-red-800':
                    comment.habitat_status === 'Nécessite des améliorations'
                }"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  [ngClass]="{
                    'bg-green-500': comment.habitat_status === 'Optimal',
                    'bg-yellow-500': comment.habitat_status === 'Acceptable',
                    'bg-red-500':
                      comment.habitat_status === 'Nécessite des améliorations'
                  }"
                ></span>
                {{ comment.habitat_status }}
              </div>

              @if (comment.is_resolved) {
              <div
                class="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>Réglé</span>
              </div>
              } @else {
              <div
                class="flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 102 0V6zm-1 8a1 1 0 100-2 1 1 0 000 2z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>En attente</span>
              </div>
              }
            </div>
          </div>

          <p class="text-quinary/80 my-4 line-clamp-3">
            {{ comment.comment }}
          </p>

          <div class="flex justify-between items-end">
            <div class="text-sm text-tertiary/70">
              Par: <span class="font-medium">{{ comment.user_name }}</span>
            </div>
            @if (comment.is_resolved) {
            <div class="text-xs text-gray-500 italic">
              Résolu par {{ comment.resolved_by }} le
              {{ comment.resolved_at | date : 'dd/MM/yyyy' }}
            </div>
            }
          </div>
        </div>
        } }
      </div>

      <div class="flex justify-center mt-8">
        <app-button
          [text]="'Fermer'"
          [type]="'button'"
          [color]="'secondary'"
          [rounded]="true"
          class="w-32 shadow-sm hover:shadow-md transition-all duration-300"
          (click)="onClose()"
        />
      </div>
    </div>
  `,
})
export class HabitatCommentHistoryComponent implements OnInit {
  @Input({ required: true }) habitatId!: number;
  @Input() habitatImage?: string;
  @Input() habitatName?: string;
  @Output() close = new EventEmitter<void>();

  comments = signal<HabitatComment[]>([]);

  constructor(private readonly habitatCommentService: HabitatCommentService) {}

  ngOnInit() {
    this.loadComments();
  }

  onClose() {
    this.close.emit();
  }

  private loadComments() {
    this.habitatCommentService
      .getCommentsByHabitatId(this.habitatId)
      .subscribe({
        next: (comments) => {
          this.comments.set(comments);
        },
        error: (error) => {
          console.error('Erreur lors du chargement des commentaires:', error);
        },
      });
  }
}
