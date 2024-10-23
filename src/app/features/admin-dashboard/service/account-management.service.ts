import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../../../core/models/role.model';
import { User } from '../../../core/models/user.model';
import { environment } from '../../../../environments/environment.development';
import { TokenService } from '../../../core/token/token.service';

@Injectable({
  providedIn: 'root',
})
export class AccountManagementService {
  private apiUrl = environment.apiUrl + '/account-management';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  // Ajouter un token JWT dans les en-têtes
  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken(); // Utilisation du TokenService
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Récupère tous les utilisateurs depuis le backend
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  // Crée un nouvel utilisateur dans le backend
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user, {
      headers: this.getAuthHeaders(),
    });
  }

  // Met à jour un utilisateur par ID dans le backend
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user, {
      headers: this.getAuthHeaders(),
    });
  }

  // Supprime un utilisateur par ID dans le backend
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Récupère les rôles via le backend
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/roles`, {
      headers: this.getAuthHeaders(),
    });
  }
}
