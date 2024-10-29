import { Component, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { Role } from '../../../core/models/role.model';
import { AccountManagementService } from '../service/account-management.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './account-management.component.html',
})
export class AccountManagementComponent implements OnInit {
  // Signaux pour la liste des utilisateurs et des rôles
  users = signal<User[]>([]);
  roles = signal<Role[]>([]);
  newUser = signal<Partial<User>>({});

  constructor(
    private router: Router,
    private accountManagement: AccountManagementService
  ) {}

  ngOnInit(): void {
    // Chargement initial des utilisateurs et des rôles
    this.loadUsers();
    this.loadRoles();
  }

  // Récupérer les utilisateurs avec une gestion d'erreurs
  loadUsers(): void {
    this.accountManagement.getAllUsers().subscribe({
      next: (users: User[]) => this.users.set(users),
      error: (err) =>
        console.error('Erreur lors de la récupération des utilisateurs :', err),
    });
  }

  // Récupérer les rôles avec une gestion d'erreurs
  loadRoles(): void {
    this.accountManagement.getRoles().subscribe({
      next: (roles: Role[]) => this.roles.set(roles),
      error: (err) =>
        console.error('Erreur lors de la récupération des rôles :', err),
    });
  }

  // Créer un utilisateur en validant les champs requis
  createAccount(): void {
    const { username, password, role } = this.newUser();
    if (username && password && role && role.id) {
      this.accountManagement
        .createUser({
          ...this.newUser(),
          roleId: role.id,
        } as User)
        .subscribe({
          next: (createdUser: User) => {
            this.users.update((users) => [...users, createdUser]);
            this.newUser.set({});
          },
          error: (err) =>
            console.error("Erreur lors de la création de l'utilisateur :", err),
        });
    } else {
      console.log('Veuillez remplir tous les champs');
    }
  }

  // Mettre à jour un utilisateur en validant les champs requis
  updateAccount(): void {
    const { username, role } = this.newUser();
    if (username && role && role.id) {
      this.accountManagement
        .updateUser({
          ...this.newUser(),
          roleId: role.id,
        } as User)
        .subscribe({
          next: () => {
            this.loadUsers();
            this.newUser.set({});
          },
          error: (err) =>
            console.error(
              "Erreur lors de la mise à jour de l'utilisateur :",
              err
            ),
        });
    } else {
      console.log('Veuillez remplir tous les champs');
    }
  }

  // Préparer le formulaire pour la modification d'un utilisateur
  editUser(user: User): void {
    this.newUser.set({ ...user, password: '' });
  }

  // Supprimer un utilisateur en fonction de son ID
  deleteAccount(userId: number): void {
    this.accountManagement.deleteUser(userId).subscribe({
      next: () =>
        this.users.update((users) =>
          users.filter((user) => user.id !== userId)
        ),
      error: (err) =>
        console.error("Erreur lors de la suppression de l'utilisateur :", err),
    });
  }

  // Réinitialiser le formulaire de création/mise à jour
  cancel(): void {
    this.newUser.set({});
  }

  // Retourner à l'accueil du tableau de bord
  goBack() {
    this.router.navigate(['/admin']);
  }
}
