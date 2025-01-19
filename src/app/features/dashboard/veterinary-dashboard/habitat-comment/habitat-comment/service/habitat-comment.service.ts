import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../../../../environments/environment';
import { HabitatComment } from '../model/habitat-comment.model';

@Injectable({
  providedIn: 'root',
})
export class HabitatCommentService {
  private readonly apiUrl = `${environment.apiUrl}/veterinary/habitat-comments`;

  constructor(private readonly http: HttpClient) {}

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

  getAllComments(): Observable<HabitatComment[]> {
    return this.http
      .get<HabitatComment[]>(`${this.apiUrl}`)
      .pipe(tap((comments) => console.log('All comments loaded:', comments)));
  }
}
