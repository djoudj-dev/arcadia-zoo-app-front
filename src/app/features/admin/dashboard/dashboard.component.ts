import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { User } from '../../../core/models/user.model';
import { AdminService } from '../service/admin.service';
import { Role } from '../../../core/models/role.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonComponent, FormsModule],
  templateUrl: './dashboard.component.html',
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

  // Charge les utilisateurs et met en cache
  loadUsers() {
    this.users = this.adminService.getAllUsers();
  }

  // Charge les rôles depuis le service admin
  loadRoles() {
    this.adminService.getRoles().subscribe((roles: Role[]) => {
      this.roles = roles;
    });
  }

  // Crée un compte utilisateur
  createAccount() {
    const { username, password, role } = this.newUser;
    if (username && password && role) {
      this.adminService.createUser(this.newUser as User);
      this.users.push(this.newUser as User); // Met à jour localement
      this.newUser = {}; // Réinitialise le formulaire
    } else {
      console.log('Veuillez remplir tous les champs');
    }
  }

  // Supprime un compte utilisateur
  deleteAccount(userId: number) {
    this.adminService.deleteUser(userId);
    this.users = this.users.filter((user) => user.id !== userId); // Mise à jour locale
  }
}
