import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserOpinion } from 'app/features/home/user-opinions/models/user-opinions.model';
import { UserOpinionsService } from 'app/features/home/user-opinions/services/user-opinions.service';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { RateComponent } from 'app/shared/components/rate/rate.component';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';

/** Type pour les statuts de filtre */
type FilterStatus = 'pending' | 'validated' | 'rejected';

/**
 * Composant de gestion des avis utilisateurs
 * Permet de valider, rejeter et supprimer les avis
 */
@Component({
  selector: 'app-user-opinion-management',
  standalone: true,
  imports: [CommonModule, ButtonComponent, RateComponent, ToastComponent],
  templateUrl: './user-opinion-management.component.html',
})
export class UserOpinionManagementComponent implements OnInit {
  /** Signaux pour la gestion d'état réactive */
  private readonly allOpinions = signal<UserOpinion[]>([]);
  public readonly readOnlySignal = signal(true);
  public readonly currentFilter = signal<FilterStatus>('pending');
  public readonly isLoading = signal(false);

  /** Options de filtrage */
  public readonly filters = [
    {
      type: 'pending' as FilterStatus,
      label: 'En attente',
      badgeColor: 'bg-yellow-500',
    },
    {
      type: 'validated' as FilterStatus,
      label: 'Validés',
      badgeColor: 'bg-green-500',
    },
    {
      type: 'rejected' as FilterStatus,
      label: 'Rejetés',
      badgeColor: 'bg-red-500',
    },
  ];

  /** Liste des avis filtrés (pour l'affichage) */
  public opinions = computed(() => {
    switch (this.currentFilter()) {
      case 'pending':
        return this.allOpinions().filter(
          (opinion) => opinion.status === 'pending'
        );
      case 'validated':
        return this.allOpinions().filter(
          (opinion) => opinion.status === 'approved'
        );
      case 'rejected':
        return this.allOpinions().filter(
          (opinion) => opinion.status === 'rejected'
        );
      default:
        return this.allOpinions();
    }
  });

  /** Compteurs */
  public pendingCount = computed(
    () =>
      this.allOpinions().filter((opinion) => opinion.status === 'pending')
        .length
  );

  public validatedCount = computed(
    () =>
      this.allOpinions().filter((opinion) => opinion.status === 'approved')
        .length
  );

  public rejectedCount = computed(
    () =>
      this.allOpinions().filter((opinion) => opinion.status === 'rejected')
        .length
  );

  constructor(
    private readonly userOpinionsService: UserOpinionsService,
    private readonly toastService: ToastService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadAllOpinions();
    this.initializeFilter();
  }

  /**
   * Initialise le filtre en fonction de l'URL
   */
  private initializeFilter(): void {
    const currentPath = this.router.url.split('/').pop();
    if (
      currentPath &&
      ['pending', 'validated', 'rejected'].includes(currentPath)
    ) {
      this.currentFilter.set(currentPath as FilterStatus);
    }
  }

  /**
   * Charge tous les avis
   */
  private loadAllOpinions(): void {
    this.isLoading.set(true);
    this.userOpinionsService.getAllUserOpinions().subscribe({
      next: (opinions) => {
        this.allOpinions.set(opinions);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des avis:', error);
        this.toastService.showError('Erreur lors du chargement des avis');
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Change le filtre actuel
   */
  changeFilter(filter: FilterStatus): void {
    this.currentFilter.set(filter);
    this.router.navigate([filter], {
      relativeTo: this.route,
      replaceUrl: true,
    });
  }

  /**
   * Retourne le nombre d'avis pour un type donné
   */
  getCount(filterType: FilterStatus): number {
    switch (filterType) {
      case 'pending':
        return this.pendingCount();
      case 'validated':
        return this.validatedCount();
      case 'rejected':
        return this.rejectedCount();
      default:
        return 0;
    }
  }

  /**
   * Valide un avis
   */
  validateOpinion(opinion: UserOpinion): void {
    if (!opinion?._id) return;

    this.userOpinionsService.validateUserOpinions(opinion._id).subscribe({
      next: () => {
        this.loadAllOpinions();
        this.toastService.showSuccess('Avis validé avec succès');
      },
      error: (error) => {
        console.error('Erreur lors de la validation:', error);
        this.toastService.showError('Erreur lors de la validation');
      },
    });
  }

  /**
   * Rejette un avis
   */
  rejectOpinion(id: string): void {
    this.userOpinionsService.rejectUserOpinions(id).subscribe({
      next: () => {
        this.loadAllOpinions();
        this.toastService.showSuccess('Avis rejeté avec succès');
      },
      error: (error) => {
        console.error('Erreur lors du rejet:', error);
        this.toastService.showError('Erreur lors du rejet');
      },
    });
  }

  /**
   * Supprime un avis
   */
  deleteOpinion(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      this.userOpinionsService.deleteUserOpinions(id).subscribe({
        next: () => {
          this.loadAllOpinions();
          this.toastService.showSuccess('Avis supprimé avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.toastService.showError('Erreur lors de la suppression');
        },
      });
    }
  }

  /**
   * Crée un signal pour le composant Rate
   */
  createRatingSignal(rating: number) {
    return signal(rating);
  }
}
