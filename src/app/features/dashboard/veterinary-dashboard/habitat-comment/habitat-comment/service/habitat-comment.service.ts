import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';
import { HabitatComment } from '../model/habitat-comment.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HabitatCommentService {
  private apiUrl = `${environment.apiUrl}/api/habitat-comment`;

  constructor(private http: HttpClient) {}

  getCommentsByHabitatId(habitatId: number): Observable<HabitatComment[]> {
    console.log('Récupération des commentaires pour habitat:', habitatId);
    return this.http
      .get<HabitatComment[]>(`${this.apiUrl}/${habitatId}`)
      .pipe(tap((comments) => console.log('Commentaires reçus:', comments)));
  }

  createHabitatComment(
    comment: Partial<HabitatComment>
  ): Observable<HabitatComment> {
    console.log('Création du commentaire:', comment);
    return this.http
      .post<HabitatComment>(this.apiUrl, comment)
      .pipe(tap((response) => console.log('Réponse création:', response)));
  }
}
