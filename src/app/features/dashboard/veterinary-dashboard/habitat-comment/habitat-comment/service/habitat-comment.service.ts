import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from 'app/core/token/token.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
    return this.http
      .get<HabitatComment[]>(`${this.apiUrl}/${habitatId}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  createHabitatComment(
    comment: Partial<HabitatComment>
  ): Observable<HabitatComment> {
    const token = this.tokenService.getToken();
    const tokenData = token ? JSON.parse(atob(token.split('.')[1])) : null;

    if (!tokenData) {
      return throwError(() => new Error('Token non valide'));
    }

    const commentWithUserData = {
      ...comment,
      id_user: tokenData.sub,
      user_name: tokenData.username || tokenData.name,
    };

    return this.http
      .post<HabitatComment>(this.apiUrl, commentWithUserData, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error('Erreur lors de la création du commentaire')
          );
        })
      );
  }

  getAllComments(): Observable<HabitatComment[]> {
    return this.http
      .get<HabitatComment[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
