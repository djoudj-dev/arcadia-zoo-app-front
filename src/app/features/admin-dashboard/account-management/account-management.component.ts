import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { StatsService } from '../stats/services/stats.service';
import { Role } from './model/role.model';
import { User } from './model/user.model';
import { AccountManagementService } from './service/account-management.service';

@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './account-management.component.html',
})
export class AccountManagementComponent implements OnInit {
  /** Signaux pour la liste des utilisateurs et des rôles **/
  users = signal<User[]>([]);
  roles = signal<Role[]>([]);

  /** Signal pour le formulaire utilisateur **/
  newUser = signal<Partial<User>>({});

  constructor(
    private router: Router,
    private accountService: AccountManagementService,
    private statsService: StatsService
  ) {}

  ngOnInit(): void {
    /** Initialisation des utilisateurs et rôles **/
    this.loadUsers();
    this.loadRoles();
  }

  /** Charge tous les utilisateurs et gère les erreurs éventuelles **/
  loadUsers(): void {
    this.accountService.getAllUsers().subscribe({
      next: (users: User[]) => this.users.set(users || []),
      error: (err) =>
        console.error('Erreur de chargement des utilisateurs :', err),
    });
  }

  /** Charge tous les rôles et gère les erreurs éventuelles **/
  loadRoles(): void {
    this.accountService.getRoles().subscribe({
      next: (roles: Role[]) => this.roles.set(roles || []),
      error: (err) => console.error('Erreur de chargement des rôles :', err),
    });
  }

  /** Crée un nouvel utilisateur si les champs sont remplis **/
  createAccount(): void {
    const { name, password, role } = this.newUser();
    if (name && password && role && role.id) {
      this.accountService
        .createUser({ ...this.newUser(), role_id: role.id } as User)
        .subscribe({
          next: (createdUser: User) => {
            this.users.update((users) => [...users, createdUser]);
            this.newUser.set({});
            this.statsService.incrementTotalEmploye();
          },
          error: (err) =>
            console.error("Erreur de création d'utilisateur :", err),
        });
    } else {
      console.log('Champs requis manquants');
    }
  }

  /** Met à jour un utilisateur si les champs sont valides **/
  updateAccount(): void {
    const { name, role } = this.newUser();

    if (name || (role && role.id)) {
      const updatedData: Partial<User & { role_id?: number }> = {
        ...this.newUser(),
      };
      if (role) updatedData.role_id = role.id;

      this.accountService.updateUser(updatedData as User).subscribe({
        next: () => {
          this.loadUsers();
          this.newUser.set({});
        },
        error: (err) =>
          console.error("Erreur de mise à jour d'utilisateur :", err),
      });
    } else {
      console.log('Champs requis manquants pour la mise à jour');
    }
  }

  /** Prépare le formulaire de modification pour un utilisateur existant **/
  editUser(user: User): void {
    this.newUser.set({ ...user, password: '' }); // Remise à zéro du mot de passe
  }

  /** Supprime un utilisateur et met à jour le compteur des employés **/
  deleteAccount(userId: number): void {
    this.accountService.deleteUser(userId).subscribe({
      next: () => {
        this.users.update((users) =>
          users.filter((user) => user.id !== userId)
        );
        this.statsService.decrementTotalEmploye();
      },
      error: (err) =>
        console.error("Erreur de suppression d'utilisateur :", err),
    });
  }

  /** Réinitialise le formulaire utilisateur **/
  cancel(): void {
    this.newUser.set({});
  }

  /** Retour à l'accueil du tableau de bord **/
  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
