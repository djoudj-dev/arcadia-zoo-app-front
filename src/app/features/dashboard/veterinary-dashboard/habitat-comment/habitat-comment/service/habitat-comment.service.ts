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

  // Dans votre service Angular HabitatCommentService, modifiez la méthode createHabitatComment :

  createHabitatComment(
    comment: Partial<HabitatComment>
  ): Observable<HabitatComment> {
    const token = this.tokenService.getToken();
    const tokenData = token ? JSON.parse(atob(token.split('.')[1])) : null;

    // Ajoutez ces lignes pour extraire le username du token
    const userId = tokenData?.sub;
    const username = tokenData?.username;

    // Modifiez l'objet envoyé pour inclure le username
    const commentWithUserData = {
      ...comment,
      id_user: userId,
      user_name: username, // Ajoutez cette ligne
    };

    return this.http.post<HabitatComment>(this.apiUrl, commentWithUserData, {
      headers: this.getHeaders(),
    });
  }

  getAllComments(): Observable<HabitatComment[]> {
    return this.http
      .get<HabitatComment[]>(`${this.apiUrl}`, { headers: this.getHeaders() })
      .pipe(tap((comments) => console.log('All comments loaded:', comments)));
  }
}
