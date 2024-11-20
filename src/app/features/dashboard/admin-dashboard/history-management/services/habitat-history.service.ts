import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CommentStatusService } from 'app/features/dashboard/admin-dashboard/opening-hours-management/services/comment-status.service';
import { HabitatComment } from 'app/features/dashboard/veterinary-dashboard/habitat-comment/habitat-comment/model/habitat-comment.model';
import { environment } from 'environments/environment.development';
import { Observable, catchError, tap, throwError } from 'rxjs';

/**
 * Service de gestion de l'historique des commentaires d'habitats
 * Gère la récupération, la résolution et la réouverture des commentaires
 */
@Injectable({
  providedIn: 'root',
})
export class HabitatHistoryService {
  /** URL de base pour les endpoints des commentaires d'habitats */
  private apiUrl = `${environment.apiUrl}/api/habitat-comment`;
  private http = inject(HttpClient);
  private commentStatusService = inject(CommentStatusService);

  /**
   * Récupère l'historique complet des commentaires d'habitats
   * @returns Observable<HabitatComment[]> Liste des commentaires avec leurs statuts
   */
  getHabitatCommentHistory(): Observable<HabitatComment[]> {
    return this.http.get<HabitatComment[]>(this.apiUrl).pipe(
      tap((comments) => {
        console.log('Commentaires récupérés:', comments);
      }),
      catchError((error) =>
        this.handleError('chargement des commentaires', error)
      )
    );
  }

  /**
   * Marque un commentaire comme résolu
   * @param commentId Identifiant du commentaire à résoudre
   * @returns Observable<HabitatComment> Commentaire mis à jour
   */
  markCommentAsResolved(commentId: string): Observable<HabitatComment> {
    const url = `${this.apiUrl}/${commentId}/resolve`;
    console.log('Tentative de résolution du commentaire:', commentId);

    return this.http.patch<HabitatComment>(url, {}).pipe(
      tap({
        next: (response) => {
          console.log('Commentaire résolu:', response);
          this.commentStatusService.emitCommentStatusChange(response);
        },
      }),
      catchError((error) =>
        this.handleError('résolution du commentaire', error)
      )
    );
  }

  /**
   * Rouvre un commentaire précédemment résolu
   * @param commentId Identifiant du commentaire à rouvrir
   * @returns Observable<HabitatComment> Commentaire mis à jour
   */
  reopenComment(commentId: string): Observable<HabitatComment> {
    const url = `${this.apiUrl}/${commentId}/reopen`;
    console.log('Tentative de réouverture du commentaire:', commentId);

    return this.http.patch<HabitatComment>(url, {}).pipe(
      tap({
        next: (response) => {
          console.log('Commentaire rouvert:', response);
          this.commentStatusService.emitCommentStatusChange(response);
        },
      }),
      catchError((error) =>
        this.handleError('réouverture du commentaire', error)
      )
    );
  }

  /**
   * Gestion centralisée des erreurs HTTP
   * @param action Description de l'action qui a échoué
   * @param error Erreur HTTP reçue
   * @returns Observable<never> Observable d'erreur formatée
   */
  private handleError(
    action: string,
    error: HttpErrorResponse
  ): Observable<never> {
    console.error(`Erreur lors de ${action}:`, error);
    return throwError(() => new Error(`Erreur lors de ${action}`));
  }
}
