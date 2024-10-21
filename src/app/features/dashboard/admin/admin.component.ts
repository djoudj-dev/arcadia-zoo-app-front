import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { User } from '../../../core/models/user.model';
import { Role } from '../../../core/models/role.model';
import { AdminService } from './service/admin.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonComponent, FormsModule],
  templateUrl: './admin.component.html',
})
export class DashboardComponent implements OnInit {
  users: User[] = [];
  roles: Role[] = [];
  newUser: Partial<User> = {}; // Stocke les données du nouveau compte

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
  }

  // Charge les utilisateurs depuis le backend
  loadUsers() {
    this.adminService.getAllUsers().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  // Charge les rôles depuis le service admin
  loadRoles() {
    this.adminService.getRoles().subscribe((roles: Role[]) => {
      this.roles = roles;
    });
  }

  // Crée un compte utilisateur via le backend
  createAccount() {
    const { username, password, role } = this.newUser;
    if (username && password && role) {
      this.adminService
        .createUser(this.newUser as User)
        .subscribe((createdUser) => {
          this.users.push(createdUser); // Met à jour la liste localement après la création
          this.newUser = {}; // Réinitialise le formulaire
        });
    } else {
      console.log('Veuillez remplir tous les champs');
    }
  }

  // Supprime un compte utilisateur via le backend
  deleteAccount(userId: number) {
    this.adminService.deleteUser(userId).subscribe(() => {
      this.users = this.users.filter((user) => user.id !== userId); // Mise à jour locale
    });
  }
}
