import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { Role } from '../../../core/models/role.model';
import { AccountManagementService } from '../service/account-management.service';
import { Router } from '@angular/router';
import { StatsService } from '../stats/services/stats.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './account-management.component.html',
})
export class AccountManagementComponent implements OnInit {
  // Utilisation de signaux pour la réactivité du composant
  users = signal<User[]>([]);
  roles = signal<Role[]>([]);
  newUser = signal<Partial<User>>({});

  constructor(
    private router: Router,
    private accountService: AccountManagementService,
    private statsService: StatsService
  ) {}

  ngOnInit(): void {
    // Initialisation des données à l'ouverture du composant
    this.loadUsers();
    this.loadRoles();
  }

  /**
   * Charge tous les utilisateurs avec gestion des erreurs
   */
  loadUsers(): void {
    this.accountService.getAllUsers().subscribe({
      next: (users: User[]) => this.users.set(users || []),
      error: (err) =>
        console.error('Erreur lors de la récupération des utilisateurs :', err),
    });
  }

  /**
   * Charge tous les rôles avec gestion des erreurs
   */
  loadRoles(): void {
    this.accountService.getRoles().subscribe({
      next: (roles: Role[]) => this.roles.set(roles || []),
      error: (err) =>
        console.error('Erreur lors de la récupération des rôles :', err),
    });
  }

  /**
   * Crée un nouvel utilisateur si les champs requis sont remplis
   */
  createAccount(): void {
    const { name, password, role } = this.newUser();
    if (name && password && role && role.id) {
      this.accountService
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

  /**
   * Met à jour un utilisateur existant, valide les champs non vides
   */
  updateAccount(): void {
    const { name, role } = this.newUser();

    if (name || (role && role.id)) {
      const updatedData: Partial<User & { roleId?: number }> = {
        ...this.newUser(),
      };
      if (role) {
        updatedData.roleId = role.id;
      }

      this.accountService.updateUser(updatedData as User).subscribe({
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

  /**
   * Prépare le formulaire pour la modification d'un utilisateur
   * @param user Utilisateur à modifier
   */
  editUser(user: User): void {
    this.newUser.set({ ...user, password: '' }); // Reset password input
  }

  /**
   * Supprime un utilisateur et décrémente le compteur des employés
   * @param userId Identifiant de l'utilisateur à supprimer
   */
  deleteAccount(userId: number): void {
    this.accountService.deleteUser(userId).subscribe({
      next: () => {
        this.users.update((users) =>
          users.filter((user) => user.id !== userId)
        );
        this.statsService.decrementTotalEmploye();
      },
      error: (err) =>
        console.error("Erreur lors de la suppression de l'utilisateur :", err),
    });
  }

  /**
   * Réinitialise le formulaire de création/mise à jour
   */
  cancel(): void {
    this.newUser.set({});
  }

  /**
   * Retourne à l'accueil du tableau de bord
   */
  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
