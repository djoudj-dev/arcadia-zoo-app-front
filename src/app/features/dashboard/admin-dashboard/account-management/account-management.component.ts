import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { ToastComponent } from 'app/shared/components/toast/toast.component';
import { CountResourceService } from '../stats-board/counts-resource/services/count-resource.service';
import { Role } from './model/role.model';
import { User } from './model/user.model';
import { AccountManagementService } from './service/account-management.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

/**
 * Composant de gestion des comptes utilisateurs
 * Permet la création, modification et suppression des comptes
 * Utilise les signaux Angular pour la gestion d'état
 */
@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, ToastComponent, ButtonComponent],
  templateUrl: './account-management.component.html',
})
export class AccountManagementComponent implements OnInit {
  /** Signaux pour la gestion d'état réactive */
  users = signal<User[]>([]); // Liste des utilisateurs
  roles = signal<Role[]>([]); // Liste des rôles disponibles
  newUser = signal<Partial<User>>({}); // Données du formulaire utilisateur

  constructor(
    private router: Router,
    private accountService: AccountManagementService,
    private countResourceService: CountResourceService,
    private toastService: ToastService
  ) {}

  /** Initialisation du composant */
  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  /** Charge la liste des utilisateurs depuis l'API */
  loadUsers(): void {
    this.accountService.getAllUsers().subscribe({
      next: (users: User[]) => this.users.set(users || []),
      error: (err) => {
        console.error('Erreur de chargement des utilisateurs :', err);
        this.toastService.showError(
          'Erreur lors du chargement des utilisateurs'
        );
      },
    });
  }

  /** Charge la liste des rôles depuis l'API */
  loadRoles(): void {
    this.accountService.getRoles().subscribe({
      next: (roles: Role[]) => this.roles.set(roles || []),
      error: (err) => {
        console.error('Erreur de chargement des rôles :', err);
        this.toastService.showError('Erreur lors du chargement des rôles');
      },
    });
  }

  /** Crée un nouvel utilisateur */
  createAccount(): void {
    const { name, email, role } = this.newUser();

    if (!name || !email || !role?.id) {
      this.toastService.showError('Veuillez remplir tous les champs requis');
      return;
    }

    const newUser: Partial<User> = {
      name,
      email,
      role_id: role.id,
    };

    this.accountService.createUser(newUser).subscribe({
      next: (createdUser: User) => {
        this.users.update((users) => [...users, createdUser]);
        this.newUser.set({});
        this.countResourceService.incrementTotalEmploye();
        this.toastService.showSuccess(
          'Compte créé avec succès ! Un email a été envoyé avec les identifiants.'
        );
      },
      error: (err) => {
        console.error("Erreur de création d'utilisateur :", err);
        this.toastService.showError(
          'Une erreur est survenue lors de la création du compte'
        );
      },
    });
  }

  /** Met à jour un utilisateur existant */
  updateAccount(): void {
    const { name, role } = this.newUser();

    if (!name || !role?.id) {
      this.toastService.showError('Informations de mise à jour incomplètes');
      return;
    }

    const updatedData: Partial<User & { role_id?: number }> = {
      ...this.newUser(),
    };
    if (role) updatedData.role_id = role.id;

    this.accountService.updateUser(updatedData as User).subscribe({
      next: () => {
        this.loadUsers();
        this.newUser.set({});
        this.toastService.showSuccess('Compte mis à jour avec succès');
      },
      error: (err) => {
        console.error("Erreur de mise à jour d'utilisateur :", err);
        this.toastService.showError(
          'Une erreur est survenue lors de la mise à jour du compte'
        );
      },
    });
  }

  /** Prépare le formulaire pour la modification d'un utilisateur */
  editUser(user: User): void {
    this.newUser.set({ ...user, password: '' });
  }

  /** Supprime un utilisateur */
  deleteAccount(userId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      this.accountService.deleteUser(userId).subscribe({
        next: () => {
          this.users.update((users) =>
            users.filter((user) => user.id !== userId)
          );
          this.countResourceService.decrementTotalEmploye();
          this.toastService.showSuccess('Compte supprimé avec succès');
        },
        error: (err) => {
          console.error("Erreur de suppression d'utilisateur :", err);
          this.toastService.showError(
            'Une erreur est survenue lors de la suppression du compte'
          );
        },
      });
    }
  }

  /** Réinitialise le formulaire */
  cancel(): void {
    this.newUser.set({});
  }

  /** Navigation vers la page d'administration */
  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
