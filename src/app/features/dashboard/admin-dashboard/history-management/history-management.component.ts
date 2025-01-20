import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { firstValueFrom } from 'rxjs';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { HabitatComment } from '../../veterinary-dashboard/habitat-comment/habitat-comment/model/habitat-comment.model';
import { HabitatHistoryService } from './services/history-management.service';

/**
 * Composant de gestion de l'historique des commentaires d'habitats
 * Permet de consulter, résoudre et rouvrir les commentaires
 */
@Component({
  standalone: true,
  imports: [DatePipe, ButtonComponent],
  selector: 'app-history-management',
  templateUrl: './history-management.component.html',
})
export class HistoryManagementComponent implements OnInit {
  /** Liste des commentaires d'habitats */
  commentHistory: HabitatComment[] = [];

  private readonly historyService = inject(HabitatHistoryService);
  private readonly toastService = inject(ToastService);

  ngOnInit(): void {
    this.loadCommentHistory();
  }

  /**
   * Charge l'historique des commentaires
   * Affiche des toasts de succès ou d'erreur
   */
  private loadCommentHistory(): void {
    this.historyService.getHabitatCommentHistory().subscribe({
      next: (history) => {
        this.commentHistory = history;
        this.toastService.showSuccess('Historique chargé avec succès');
      },
      error: (error) => {
        console.error("Erreur lors du chargement de l'historique:", error);
        this.toastService.showError(
          "Erreur lors du chargement de l'historique"
        );
      },
    });
  }

  /**
   * Marque un commentaire comme résolu
   * @param commentId Identifiant du commentaire
   */
  async markAsResolved(commentId: string) {
    if (!commentId) {
      this.toastService.showError('ID du commentaire manquant');
      return;
    }

    try {
      await firstValueFrom(
        this.historyService.markCommentAsResolved(commentId)
      );
      this.loadCommentHistory();
      this.toastService.showSuccess('Commentaire marqué comme résolu');
    } catch (error) {
      console.error('Erreur lors du marquage comme résolu:', error);
      this.toastService.showError(
        'Erreur lors de la résolution du commentaire'
      );
    }
  }

  /**
   * Rouvre un commentaire précédemment résolu
   * @param commentId Identifiant du commentaire
   */
  async reopenComment(commentId: string) {
    if (!commentId) {
      this.toastService.showError('ID du commentaire manquant');
      return;
    }

    try {
      await firstValueFrom(this.historyService.reopenComment(commentId));
      this.loadCommentHistory();
      this.toastService.showSuccess('Commentaire rouvert avec succès');
    } catch (error) {
      console.error('Erreur lors de la réouverture du commentaire:', error);
      this.toastService.showError(
        'Erreur lors de la réouverture du commentaire'
      );
    }
  }
}
