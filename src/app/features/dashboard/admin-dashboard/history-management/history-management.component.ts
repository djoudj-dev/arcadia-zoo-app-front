import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { HabitatComment } from '../../veterinary-dashboard/habitat-comment/habitat-comment/model/habitat-comment.model';
import { HabitatHistoryService } from './services/history-management.service';

@Component({
  standalone: true,
  imports: [DatePipe, ButtonComponent],
  selector: 'app-history-management',
  templateUrl: './history-management.component.html',
})
export class HistoryManagementComponent implements OnInit {
  commentHistory: HabitatComment[] = [];
  private historyService = inject(HabitatHistoryService);

  ngOnInit(): void {
    this.loadCommentHistory();
  }

  private loadCommentHistory(): void {
    this.historyService.getHabitatCommentHistory().subscribe({
      next: (history) => {
        console.log('Commentaires reçus:', history);
        history.forEach((comment) => {
          if (!comment._id) {
            console.warn('Commentaire sans ID:', comment);
          }
        });
        this.commentHistory = history;
      },
      error: (error) => {
        console.error("Erreur lors du chargement de l'historique:", error);
      },
    });
  }

  async markAsResolved(commentId: string) {
    console.log('markAsResolved appelé avec ID:', commentId);

    if (!commentId) {
      console.error('ID du commentaire manquant');
      return;
    }

    try {
      const result = await this.historyService
        .markCommentAsResolved(commentId)
        .toPromise();
      console.log('Résultat de la résolution:', result);
      this.loadCommentHistory();
    } catch (error) {
      console.error('Erreur lors du marquage comme résolu:', error);
    }
  }

  async reopenComment(commentId: string) {
    console.log('Tentative de réouverture du commentaire:', commentId);
    if (!commentId) {
      console.error('ID du commentaire manquant');
      return;
    }

    try {
      const result = await this.historyService
        .reopenComment(commentId)
        .toPromise();
      console.log('Résultat de la réouverture:', result);
      this.loadCommentHistory();
    } catch (error) {
      console.error('Erreur lors de la réouverture du commentaire:', error);
    }
  }
}
