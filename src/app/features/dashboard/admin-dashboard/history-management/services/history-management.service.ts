import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CommentStatusService } from 'app/features/dashboard/admin-dashboard/opening-hours-management/services/comment-status.service';
import { HabitatComment } from 'app/features/dashboard/veterinary-dashboard/habitat-comment/habitat-comment/model/habitat-comment.model';
import { environment } from 'environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HabitatHistoryService {
  private readonly apiUrl = `${environment.apiUrl}/api/veterinary/habitat-comments`;
  private readonly http = inject(HttpClient);
  private readonly commentStatusService = inject(CommentStatusService);

  constructor() {}

  getHabitatCommentHistory(): Observable<HabitatComment[]> {
    return this.http.get<HabitatComment[]>(this.apiUrl);
  }

  markCommentAsResolved(commentId: string) {
    const url = `${this.apiUrl}/${commentId}/resolve`;
    return this.http.patch<HabitatComment>(url, {}).pipe(
      tap({
        next: (response) => {
          this.commentStatusService.emitCommentStatusChange(response);
        },
        error: () => {},
      })
    );
  }

  reopenComment(commentId: string) {
    const url = `${this.apiUrl}/${commentId}/reopen`;
    return this.http.patch<HabitatComment>(url, {}).pipe(
      tap({
        next: (response) => {
          this.commentStatusService.emitCommentStatusChange(response);
        },
        error: () => {},
      })
    );
  }
}
