import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { Role } from '../../../core/models/role.model';
import { AccountManagementService } from '../service/account-management.service';

@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './account-management.component.html',
})
export class AccountManagementComponent implements OnInit {
  users: User[] = []; // Liste des utilisateurs chargés depuis le backend
  roles: Role[] = []; // Liste des rôles chargés depuis le backend
  newUser: Partial<User> = {}; // Formulaire de création/mise à jour d'utilisateur

  constructor(private accountManagement: AccountManagementService) {}

  ngOnInit(): void {
    this.loadUsers(); // Charger la liste des utilisateurs au démarrage
    this.loadRoles(); // Charger la liste des rôles au démarrage
  }

  // Charge les utilisateurs depuis le backend
  loadUsers(): void {
    this.accountManagement.getAllUsers().subscribe({
      next: (users: User[]) => {
        console.log('Utilisateurs récupérés :', users); // Debugging
        this.users = users; // Mise à jour de la liste des utilisateurs
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des utilisateurs :', err);
      },
    });
  }

  // Charge les rôles depuis le service
  loadRoles(): void {
    this.accountManagement.getRoles().subscribe({
      next: (roles: Role[]) => {
        console.log('Rôles récupérés :', roles); // Debugging
        this.roles = roles; // Mise à jour de la liste des rôles
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des rôles :', err);
      },
    });
  }

  // Crée un compte utilisateur via le backend
  createAccount(): void {
    const { username, password, role } = this.newUser;

    if (username && password && role && role.id) {
      this.accountManagement
        .createUser({
          ...this.newUser,
          roleId: role.id, // Utiliser roleId du rôle sélectionné
        } as User)
        .subscribe({
          next: (createdUser: User) => {
            this.users.push(createdUser); // Ajoute le nouvel utilisateur à la liste
            this.newUser = {}; // Réinitialiser le formulaire après création
          },
          error: (err) => {
            console.error("Erreur lors de la création de l'utilisateur :", err);
          },
        });
    } else {
      console.log('Veuillez remplir tous les champs');
    }
  }

  // Met à jour un compte utilisateur via le backend
  updateAccount(): void {
    const { username, role } = this.newUser;

    // Pas de mot de passe requis si non modifié
    if (username && role && role.id) {
      this.accountManagement
        .updateUser({
          ...this.newUser,
          roleId: role.id, // Utiliser roleId du rôle sélectionné
        } as User)
        .subscribe({
          next: () => {
            console.log('Compte utilisateur mis à jour');
            this.newUser = {}; // Réinitialiser le formulaire après mise à jour
            this.loadUsers(); // Recharger la liste des utilisateurs
          },
          error: (err) => {
            console.error(
              "Erreur lors de la mise à jour de l'utilisateur :",
              err
            );
          },
        });
    } else {
      console.log('Veuillez remplir tous les champs');
    }
  }

  // Remplit le formulaire avec les informations de l'utilisateur sélectionné pour modification
  editUser(user: User): void {
    this.newUser = { ...user, password: '' }; // Réinitialiser le mot de passe lors de la modification
  }

  // Supprime un compte utilisateur via le backend
  deleteAccount(userId: number): void {
    this.accountManagement.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter((user) => user.id !== userId); // Mise à jour locale de la liste des utilisateurs
      },
      error: (err) => {
        console.error("Erreur lors de la suppression de l'utilisateur :", err);
      },
    });
  }

  // Réinitialise le formulaire de création/mise à jour d'utilisateur
  cancel(): void {
    this.newUser = {}; // Réinitialisation du formulaire
  }
}
