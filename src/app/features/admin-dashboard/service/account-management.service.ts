import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Role } from '../../../core/models/role.model';
import { User } from '../../../core/models/user.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AccountManagementService {
  private apiUrl = environment.apiUrl + '/admin/account-management';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError((err) => {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
        return throwError(
          () => new Error('Erreur lors de la récupération des utilisateurs.')
        );
      })
    );
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      catchError((err) => {
        console.error('Erreur lors de la création de l’utilisateur:', err);
        return throwError(
          () => new Error('Erreur lors de la création de l’utilisateur.')
        );
      })
    );
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user).pipe(
      catchError((err) => {
        console.error('Erreur lors de la mise à jour de l’utilisateur:', err);
        return throwError(
          () => new Error('Erreur lors de la mise à jour de l’utilisateur.')
        );
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((err) => {
        console.error('Erreur lors de la suppression de l’utilisateur:', err);
        return throwError(
          () => new Error('Erreur lors de la suppression de l’utilisateur.')
        );
      })
    );
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/roles`).pipe(
      catchError((err) => {
        console.error('Erreur lors de la récupération des rôles:', err);
        return throwError(
          () => new Error('Erreur lors de la récupération des rôles.')
        );
      })
    );
  }
}
