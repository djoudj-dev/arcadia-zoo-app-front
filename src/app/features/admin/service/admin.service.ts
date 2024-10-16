import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../core/models/user.model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  users = signal<User[]>([]);

  getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.apiUrl}/users`)
      .pipe(tap((users) => this.users.set(users)));
  }

  // Créer un utilisateur
  createUser(user: User) {
    return this.http.post(`${this.apiUrl}/users`, user);
  }
}
