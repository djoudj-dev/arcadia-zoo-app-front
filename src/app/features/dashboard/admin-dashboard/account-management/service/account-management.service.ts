import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { Role } from '../model/role.model';
import { User } from '../model/user.model';

/**
 * Service de gestion des comptes utilisateurs
 * Gère toutes les opérations CRUD liées aux comptes
 */
@Injectable({
  providedIn: 'root',
})
export class AccountManagementService {
  /** URL de base pour les endpoints de gestion des comptes */
  private readonly apiUrl = `${environment.apiUrl}/api/admin/account-management`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Récupère la liste complète des utilisateurs
   * @returns Observable<User[]> Liste des utilisateurs
   */
  getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.apiUrl)
      .pipe(
        catchError((err) =>
          this.handleError('chargement des utilisateurs', err)
        )
      );
  }

  /**
   * Crée un nouvel utilisateur
   * @param user Données du nouvel utilisateur
   * @returns Observable<User> Utilisateur créé
   */
  createUser(user: Partial<User>): Observable<User> {
    return this.http
      .post<User>(this.apiUrl, user)
      .pipe(
        catchError((err) => this.handleError('création dutilisateur', err))
      );
  }
  /**
   * Met à jour un utilisateur existant
   * @param user Données mises à jour de l'utilisateur
   * @returns Observable<User> Utilisateur mis à jour
   */
  updateUser(user: User): Observable<User> {
    return this.http
      .put<User>(`${this.apiUrl}/${user.id}`, user)
      .pipe(
        catchError((err) => this.handleError('mise à jour dutilisateur', err))
      );
  }

  /**
   * Supprime un utilisateur
   * @param id ID de l'utilisateur à supprimer
   * @returns Observable<void>
   */
  deleteUser(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError((err) => this.handleError('suppression dutilisateur', err))
      );
  }

  /**
   * Récupère la liste des rôles disponibles
   * @returns Observable<Role[]> Liste des rôles
   */
  getRoles(): Observable<Role[]> {
    return this.http
      .get<Role[]>(`${this.apiUrl}/roles`)
      .pipe(catchError((err) => this.handleError('chargement des rôles', err)));
  }

  /**
   * Gestion centralisée des erreurs HTTP
   * @param action Description de l'action qui a échoué
   * @param err Erreur HTTP
   * @returns Observable<never> Observable d'erreur
   */
  private handleError(
    action: string,
    err: HttpErrorResponse
  ): Observable<never> {
    console.error(`Erreur lors de ${action} :`, err.message);
    return throwError(() => new Error(`Erreur de ${action}.`));
  }

  /**
   * Met à jour le mot de passe d'un utilisateur
   * @param currentPassword Mot de passe actuel
   * @param newPassword Nouveau mot de passe
   * @returns Observable<{message: string}> Message de confirmation
   */
  updatePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/update-password`,
      {
        currentPassword,
        newPassword,
      }
    );
  }
}
