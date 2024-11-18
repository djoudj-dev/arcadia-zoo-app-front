import { CommonModule } from '@angular/common';
import { Component, computed, Input, OnInit, signal } from '@angular/core';
import { HabitatComment } from '../habitat-comment/model/habitat-comment.model';
import { HabitatCommentService } from '../habitat-comment/service/habitat-comment.service';

@Component({
  selector: 'app-habitat-comment-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      @if (comments().length === 0) {
      <p class="text-center text-gray-500">
        Aucun commentaire pour cet habitat
      </p>
      } @else { @for (comment of filteredComments(); track
      comment.id_habitat_comment) {
      <div
        class="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <p class="text-sm text-gray-600 mb-1">
              Date: {{ comment.createdAt | date : 'dd/MM/yyyy à HH:mm' }}
            </p>
            <p class="text-sm text-gray-600 mb-1">
              Par: {{ comment.user_name }}
            </p>
            <p class="text-sm text-gray-600 mb-1">
              État: {{ comment.habitat_status }}
            </p>
          </div>
        </div>
        <div class="prose prose-sm max-w-none">
          <p class="text-gray-800 whitespace-pre-wrap">{{ comment.comment }}</p>
        </div>
      </div>
      } }
    </div>
  `,
})
export class HabitatCommentHistoryComponent implements OnInit {
  @Input({ required: true }) habitatId!: number;
  comments = signal<HabitatComment[]>([]);

  filteredComments = computed(() =>
    this.comments().filter((comment) => comment.id_habitat === this.habitatId)
  );

  constructor(private habitatCommentService: HabitatCommentService) {}

  ngOnInit() {
    this.loadComments();
  }

  private loadComments() {
    this.habitatCommentService
      .getCommentsByHabitatId(this.habitatId)
      .subscribe({
        next: (comments) => {
          console.log('Commentaires reçus:', comments);
          this.comments.set(comments);
        },
        error: (error) => {
          console.error('Erreur lors du chargement des commentaires:', error);
        },
      });
  }
}
