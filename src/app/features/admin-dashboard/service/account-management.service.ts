import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Role } from '../../../core/models/role.model';
import { User } from '../../../core/models/user.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AccountManagementService {
  private apiUrl = `${environment.apiUrl}/admin/account-management`;

  constructor(private http: HttpClient) {}

  // Récupérer tous les utilisateurs
  getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.apiUrl)
      .pipe(
        catchError((err) =>
          this.handleError('récupération des utilisateurs', err)
        )
      );
  }

  // Créer un utilisateur
  createUser(user: User): Observable<User> {
    return this.http
      .post<User>(this.apiUrl, user)
      .pipe(
        catchError((err) => this.handleError('création de l’utilisateur', err))
      );
  }

  // Mettre à jour un utilisateur
  updateUser(user: User): Observable<User> {
    return this.http
      .put<User>(`${this.apiUrl}/${user.id}`, user)
      .pipe(
        catchError((err) =>
          this.handleError('mise à jour de l’utilisateur', err)
        )
      );
  }

  // Supprimer un utilisateur
  deleteUser(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError((err) =>
          this.handleError('suppression de l’utilisateur', err)
        )
      );
  }

  // Récupérer tous les rôles
  getRoles(): Observable<Role[]> {
    return this.http
      .get<Role[]>(`${this.apiUrl}/roles`)
      .pipe(
        catchError((err) => this.handleError('récupération des rôles', err))
      );
  }

  // Gestion centralisée des erreurs
  private handleError(
    action: string,
    err: HttpErrorResponse
  ): Observable<never> {
    console.error(`Erreur lors de la ${action} :`, err);
    return throwError(() => new Error(`Erreur lors de la ${action}.`));
  }
}
