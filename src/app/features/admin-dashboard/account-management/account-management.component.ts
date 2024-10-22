import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { Role } from '../../../core/models/role.model';
import { AdminService } from '../service/admin.service';
import { DashboardComponent } from '../admin-dashboard.component';

@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    FormsModule,
    DashboardComponent,
  ],
  templateUrl: './account-management.component.html',
  styleUrl: './account-management.component.css',
})
export class AccountManagementComponent implements OnInit {
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
      console.log(users);
      this.users = users;
    });
  }

  // Charge les rôles depuis le service admin
  loadRoles() {
    this.adminService.getRoles().subscribe({
      next: (roles: Role[]) => {
        console.log('Rôles récupérés :', roles); // Vérifie si les rôles sont bien récupérés
        this.roles = roles;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des rôles:', err);
      },
    });
  }

  // Crée un compte utilisateur via le backend
  createAccount() {
    const { username, password, role } = this.newUser;

    if (username && password && role && role.id) {
      this.adminService
        .createUser({
          ...this.newUser,
          roleId: role.id, // Extraire roleId du rôle sélectionné
        } as User)
        .subscribe((createdUser) => {
          this.users.push(createdUser);
          this.newUser = {}; // Réinitialiser le formulaire
        });
    } else {
      console.log('Veuillez remplir tous les champs');
    }
  }

  // Met à jour un compte utilisateur via le backend
  updateAccount() {
    const { username, role } = this.newUser;

    // Pas besoin de mot de passe pour la mise à jour si non modifié
    if (username && role && role.id) {
      this.adminService
        .updateUser({
          ...this.newUser,
          roleId: role.id, // Extraire roleId du rôle sélectionné
        } as User)
        .subscribe(() => {
          console.log('Compte utilisateur mis à jour');
          this.newUser = {}; // Réinitialiser le formulaire
          this.loadUsers(); // Recharger la liste des utilisateurs mis à jour
        });
    } else {
      console.log('Veuillez remplir tous les champs');
    }
  }

  // Méthode pour pré-remplir le formulaire avec les infos de l'utilisateur à modifier
  editUser(user: User) {
    this.newUser = { ...user, password: '' }; // Copie les infos de l'utilisateur sans le mot de passe
  }

  // Supprime un compte utilisateur via le backend
  deleteAccount(userId: number) {
    this.adminService.deleteUser(userId).subscribe(() => {
      this.users = this.users.filter((user) => user.id !== userId); // Mise à jour locale
    });
  }
}
