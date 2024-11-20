import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HabitatComment } from '../../../veterinary-dashboard/habitat-comment/habitat-comment/model/habitat-comment.model';

/**
 * Service de gestion du statut des commentaires
 * Gère les notifications de changement d'état des commentaires
 */
@Injectable({
  providedIn: 'root',
})
export class CommentStatusService {
  /** Subject pour la gestion des changements de statut */
  private commentStatusChanged = new Subject<HabitatComment>();

  /** Observable public pour s'abonner aux changements de statut */
  commentStatusChanged$ = this.commentStatusChanged.asObservable();

  /**
   * Émet un événement de changement de statut
   * @param comment Commentaire dont le statut a changé
   */
  emitCommentStatusChange(comment: HabitatComment) {
    this.commentStatusChanged.next(comment);
  }
}
