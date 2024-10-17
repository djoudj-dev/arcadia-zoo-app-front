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

  loadUsers() {
    this.adminService.getAllUsers().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  loadRoles() {
    this.adminService.getRoles().subscribe((roles: Role[]) => {
      this.roles = roles;
    });
  }

  // Méthode pour créer un compte
  createAccount() {
    if (this.newUser.username && this.newUser.password && this.newUser.role) {
      this.adminService.createUser(this.newUser as User);
      this.loadUsers(); // Recharge les utilisateurs après création
      this.newUser = {}; // Réinitialise le formulaire
    } else {
      console.log('Veuillez remplir tous les champs');
    }
  }

  // Méthode pour supprimer un compte
  deleteAccount(userId: number) {
    this.adminService.deleteUser(userId);
    this.loadUsers(); // Recharge les utilisateurs après suppression
  }
}
