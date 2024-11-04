import { Component, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { Role } from '../../../core/models/role.model';
import { AccountManagementService } from '../service/account-management.service';
import { Router } from '@angular/router';
import { StatsService } from '../stats/services/stats.service';

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
    private accountManagement: AccountManagementService,
    private statsService: StatsService
  ) {}

  ngOnInit(): void {
    // Chargement initial des utilisateurs et des rôles
    this.loadUsers();
    this.loadRoles();
  }

  // Récupérer les utilisateurs avec une gestion d'erreurs
  loadUsers(): void {
    this.accountManagement.getAllUsers().subscribe({
      next: (users: User[]) => this.users.set(users || []), // Assure un tableau même si users est undefined
      error: (err) =>
        console.error('Erreur lors de la récupération des utilisateurs :', err),
    });
  }

  // Récupérer les rôles avec une gestion d'erreurs
  loadRoles(): void {
    this.accountManagement.getRoles().subscribe({
      next: (roles: Role[]) => this.roles.set(roles || []), // Assure un tableau même si roles est undefined
      error: (err) =>
        console.error('Erreur lors de la récupération des rôles :', err),
    });
  }

  // Créer un utilisateur en validant les champs requis
  createAccount(): void {
    const { name, password, role } = this.newUser();
    if (name && password && role && role.id) {
      this.accountManagement
        .createUser({
          ...this.newUser(),
          roleId: role.id,
        } as User)
        .subscribe({
          next: (createdUser: User) => {
            this.users.update((users) => [...users, createdUser]);
            this.newUser.set({});
            this.statsService.incrementTotalEmploye();
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
    const { name, role } = this.newUser();

    // Vérifier s'il y a au moins un champ à mettre à jour
    if (name || (role && role.id)) {
      const updatedData: Partial<User & { roleId?: number }> = {
        ...this.newUser(),
      };
      if (role) {
        updatedData.roleId = role.id;
      }

      this.accountManagement.updateUser(updatedData as User).subscribe({
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
      console.log('Veuillez remplir au moins un champ pour mettre à jour.');
    }
  }

  // Préparer le formulaire pour la modification d'un utilisateur
  editUser(user: User): void {
    this.newUser.set({ ...user, password: '' });
  }

  // Supprimer un utilisateur en fonction de son ID
  deleteAccount(userId: number): void {
    this.accountManagement.deleteUser(userId).subscribe({
      next: () => {
        // Met à jour la liste des utilisateurs
        this.users.update((users) =>
          users.filter((user) => user.id !== userId)
        );

        // Décrémente le compteur employé après la suppression réussie
        this.statsService.decrementTotalEmploye();
      },
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
