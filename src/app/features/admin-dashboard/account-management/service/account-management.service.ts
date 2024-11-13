import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { Role } from '../model/role.model';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class AccountManagementService {
  private apiUrl = `${environment.apiUrl}/api/admin/account-management`;

  constructor(private http: HttpClient) {}

  /** Récupère tous les utilisateurs **/
  getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.apiUrl)
      .pipe(
        catchError((err) =>
          this.handleError('chargement des utilisateurs', err)
        )
      );
  }

  /** Crée un nouvel utilisateur **/
  createUser(user: User): Observable<User> {
    return this.http
      .post<User>(this.apiUrl, user)
      .pipe(
        catchError((err) => this.handleError('création d’utilisateur', err))
      );
  }

  /** Met à jour un utilisateur existant **/
  updateUser(user: User): Observable<User> {
    return this.http
      .put<User>(`${this.apiUrl}/${user.id}`, user)
      .pipe(
        catchError((err) => this.handleError('mise à jour d’utilisateur', err))
      );
  }

  /** Supprime un utilisateur par ID **/
  deleteUser(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError((err) => this.handleError('suppression d’utilisateur', err))
      );
  }

  /** Récupère tous les rôles **/
  getRoles(): Observable<Role[]> {
    return this.http
      .get<Role[]>(`${this.apiUrl}/roles`)
      .pipe(catchError((err) => this.handleError('chargement des rôles', err)));
  }

  /** Gère les erreurs HTTP de façon centralisée **/
  private handleError(
    action: string,
    err: HttpErrorResponse
  ): Observable<never> {
    console.error(`Erreur lors de ${action} :`, err.message);
    return throwError(() => new Error(`Erreur de ${action}.`));
  }
}
