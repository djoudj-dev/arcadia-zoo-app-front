import { Injectable } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { Observable, of } from 'rxjs';
import { USERS } from '../../../core/mocks/user-mock.component';
import { Role } from '../../../core/models/role.model';
import { ROLES } from '../../../core/mocks/role-mock.component';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  // private http = inject(HttpClient);
  // private apiUrl = environment.apiUrl;

  // users = signal<User[]>([]);

  getAllUsers(): Observable<User[]> {
    console.log('Mock USERS:', USERS); // Vérifiez si les utilisateurs sont dans le mock
    return of(USERS);
  }

  getRoles(): Observable<Role[]> {
    return of(ROLES);
  }

  // Créer un utilisateur
  createUser(user: User) {
    USERS.push(user);
  }
}
