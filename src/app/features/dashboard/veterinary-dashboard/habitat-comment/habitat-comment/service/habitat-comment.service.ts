import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from 'app/core/token/token.service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../../../../environments/environment';
import { HabitatComment } from '../model/habitat-comment.model';

@Injectable({
  providedIn: 'root',
})
export class HabitatCommentService {
  private readonly apiUrl = `${environment.apiUrl}/api/veterinary/habitat-comments`;

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
      .pipe(
        tap((comments) => {
          console.log('Commentaires reçus:', comments);
        }),
        catchError((error) => {
          console.error(
            'Erreur lors de la récupération des commentaires:',
            error
          );
          return throwError(() => error);
        })
      );
  }

  createHabitatComment(
    comment: Partial<HabitatComment>
  ): Observable<HabitatComment> {
    const token = this.tokenService.getToken();
    const tokenData = token ? JSON.parse(atob(token.split('.')[1])) : null;

    console.log('Token décodé:', tokenData);

    if (!tokenData) {
      return throwError(() => new Error('Token non valide'));
    }

    const commentWithUserData = {
      ...comment,
      id_user: tokenData.sub,
      user_name: tokenData.username || tokenData.name,
    };

    console.log('Données du commentaire à envoyer:', commentWithUserData);

    return this.http
      .post<HabitatComment>(this.apiUrl, commentWithUserData, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((response) => {
          console.log('Réponse du serveur:', response);
        }),
        catchError((error) => {
          console.error('Erreur lors de la création du commentaire:', error);
          return throwError(
            () => new Error('Erreur lors de la création du commentaire')
          );
        })
      );
  }

  getAllComments(): Observable<HabitatComment[]> {
    console.log('Récupération de tous les commentaires');
    return this.http
      .get<HabitatComment[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        tap((comments) => {
          console.log('Tous les commentaires chargés:', comments);
        }),
        catchError((error) => {
          console.error('Erreur lors du chargement des commentaires:', error);
          return throwError(() => error);
        })
      );
  }
}
