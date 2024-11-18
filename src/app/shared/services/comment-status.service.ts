import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HabitatComment } from '../../features/dashboard/veterinary-dashboard/habitat-comment/habitat-comment/model/habitat-comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentStatusService {
  private commentStatusChanged = new Subject<HabitatComment>();

  commentStatusChanged$ = this.commentStatusChanged.asObservable();

  emitCommentStatusChange(comment: HabitatComment) {
    this.commentStatusChanged.next(comment);
  }
}
