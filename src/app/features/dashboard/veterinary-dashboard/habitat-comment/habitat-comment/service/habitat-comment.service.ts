import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from 'app/core/token/token.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
    return this.http.get<HabitatComment[]>(`${this.apiUrl}/${habitatId}`, {
      headers: this.getHeaders(),
    });
  }

  createHabitatComment(
    comment: Partial<HabitatComment>
  ): Observable<HabitatComment> {
    const token = this.tokenService.getToken();
    const tokenData = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const userId = tokenData?.sub;

    const commentWithUserId = {
      ...comment,
      id_user: userId,
    };

    console.log('Création du commentaire:', commentWithUserId);
    return this.http
      .post<HabitatComment>(this.apiUrl, commentWithUserId, {
        headers: this.getHeaders(),
      })
      .pipe(tap((response) => console.log('Réponse création:', response)));
  }

  getAllComments(): Observable<HabitatComment[]> {
    return this.http
      .get<HabitatComment[]>(`${this.apiUrl}`, { headers: this.getHeaders() })
      .pipe(tap((comments) => console.log('All comments loaded:', comments)));
  }
}
