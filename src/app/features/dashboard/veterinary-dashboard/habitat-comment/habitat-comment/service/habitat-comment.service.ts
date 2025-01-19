import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from 'app/core/token/token.service';
import { Habitat } from 'app/features/habitats/models/habitat.model';
import { Observable, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../../../../environments/environment';
import { HabitatComment } from '../model/habitat-comment.model';

@Injectable({
  providedIn: 'root',
})
export class HabitatCommentService {
  private readonly apiUrl = `${environment.apiUrl}/api/veterinary/habitat-comments`;
  private readonly habitatApiUrl = `${environment.apiUrl}/api/habitats`;

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getCommentsByHabitatId(habitatId: number): Observable<HabitatComment[]> {
    console.log('Récupération des commentaires pour habitat:', habitatId);
    return this.http
      .get<HabitatComment[]>(`${this.apiUrl}/${habitatId}`, {
        headers: this.getHeaders(),
      })
      .pipe(tap((comments) => console.log('Commentaires reçus:', comments)));
  }

  createHabitatComment(
    comment: Partial<HabitatComment>
  ): Observable<HabitatComment> {
    console.log(
      "Récupération des informations de l'habitat:",
      comment.id_habitat
    );
    // D'abord récupérer les informations de l'habitat
    return this.http
      .get<Habitat>(`${this.habitatApiUrl}/${comment.id_habitat}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        switchMap((habitat) => {
          const completeComment = {
            ...comment,
            habitat_name: habitat.name, // Ajout du nom de l'habitat
          };
          console.log(
            'Création du commentaire avec les données complètes:',
            completeComment
          );
          return this.http.post<HabitatComment>(this.apiUrl, completeComment, {
            headers: this.getHeaders(),
          });
        }),
        tap((response) => console.log('Réponse création:', response))
      );
  }

  getAllComments(): Observable<HabitatComment[]> {
    return this.http
      .get<HabitatComment[]>(`${this.apiUrl}`, { headers: this.getHeaders() })
      .pipe(tap((comments) => console.log('All comments loaded:', comments)));
  }
}
