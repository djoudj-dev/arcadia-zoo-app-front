import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserOpinion } from 'app/features/home/user-opinions/models/user-opinions.model';
import { UserOpinionsService } from 'app/features/home/user-opinions/services/user-opinions.service';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { RateComponent } from 'app/shared/components/rate/rate.component';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';

interface FilterOption {
  type: 'pending' | 'validated' | 'rejected';
  label: string;
  badgeColor: string;
}

@Component({
  selector: 'app-user-opinion-management',
  standalone: true,
  imports: [CommonModule, ButtonComponent, RateComponent, ToastComponent],
  templateUrl: './user-opinion-management.component.html',
})
export class UserOpinionManagementComponent implements OnInit {
  // Liste de tous les avis
  private allOpinions = signal<UserOpinion[]>([]);

  // Liste des avis filtrés (pour l'affichage)
  public opinions = computed(() => {
    switch (this.currentFilter()) {
      case 'pending':
        return this.allOpinions().filter(
          (opinion) => !opinion.validated && !opinion.rejected
        );
      case 'validated':
        return this.allOpinions().filter((opinion) => opinion.validated);
      case 'rejected':
        return this.allOpinions().filter((opinion) => opinion.rejected);
      default:
        return this.allOpinions();
    }
  });

  // Indicateur de chargement
  isLoading = signal<boolean>(true);

  // Filtre actuel (par défaut : "en attente")
  currentFilter = signal<'pending' | 'validated' | 'rejected'>('pending');

  // Signal pour le mode lecture seule
  readOnlySignal = signal(true);

  // Création des compteurs réactifs avec computed()
  public pendingCount = computed(
    () =>
      this.allOpinions().filter(
        (opinion) => !opinion.validated && !opinion.rejected
      ).length
  );

  public validatedCount = computed(
    () => this.allOpinions().filter((opinion) => opinion.validated).length
  );

  public rejectedCount = computed(
    () => this.allOpinions().filter((opinion) => opinion.rejected).length
  );

  filters: FilterOption[] = [
    {
      type: 'pending',
      label: 'En attente',
      badgeColor: 'bg-yellow-500',
    },
    {
      type: 'validated',
      label: 'Validés',
      badgeColor: 'bg-green-500',
    },
    {
      type: 'rejected',
      label: 'Rejetés',
      badgeColor: 'bg-red-500',
    },
  ];

  constructor(
    private userOpinionsService: UserOpinionsService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // S'abonner aux mises à jour des avis
    this.userOpinionsService.opinionsUpdated$.subscribe(() => {
      this.loadAllOpinions();
    });
  }

  ngOnInit(): void {
    this.loadAllOpinions();
    // Initialiser le filtre en fonction de l'URL actuelle
    const currentPath = this.router.url.split('/').pop();
    if (
      currentPath &&
      ['pending', 'validated', 'rejected'].includes(currentPath)
    ) {
      this.currentFilter.set(
        currentPath as 'pending' | 'validated' | 'rejected'
      );
    }
  }

  // Charger tous les avis
  loadAllOpinions(): void {
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

  // Mise à jour du filtre actuel
  changeFilter(filter: 'pending' | 'validated' | 'rejected'): void {
    this.currentFilter.set(filter);
    // Mettre à jour l'URL sans recharger la page
    this.router.navigate([filter], {
      relativeTo: this.route,
      replaceUrl: true,
    });
  }

  // Méthodes pour compter les avis par catégorie (utilisant allOpinions)
  getPendingCount(): number {
    return this.allOpinions().filter(
      (opinion) => !opinion.validated && !opinion.rejected
    ).length;
  }

  getValidatedCount(): number {
    return this.allOpinions().filter((opinion) => opinion.validated).length;
  }

  getRejectedCount(): number {
    return this.allOpinions().filter((opinion) => opinion.rejected).length;
  }

  // Après chaque action (validation, rejet, suppression), recharger tous les avis
  validateOpinion(opinion: UserOpinion): void {
    if (!opinion?._id) return;

    this.userOpinionsService.validateUserOpinions(opinion._id).subscribe({
      next: () => {
        this.toastService.showSuccess('Avis validé avec succès');
        this.loadAllOpinions(); // Recharger tous les avis
      },
      error: (error) => {
        console.error('Erreur lors de la validation:', error);
        this.toastService.showError('Erreur lors de la validation');
      },
    });
  }

  rejectOpinion(id: string): void {
    this.userOpinionsService.rejectUserOpinions(id).subscribe({
      next: () => {
        this.toastService.showSuccess('Avis rejeté avec succès');
        this.loadAllOpinions(); // Recharger tous les avis après le rejet
      },
      error: (error) => {
        console.error('Erreur lors du rejet:', error);
        this.toastService.showError('Erreur lors du rejet');
      },
    });
  }

  deleteOpinion(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      this.userOpinionsService.deleteUserOpinions(id).subscribe({
        next: () => {
          this.toastService.showSuccess('Avis supprimé avec succès');
          this.loadAllOpinions(); // Recharger tous les avis
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.toastService.showError('Erreur lors de la suppression');
        },
      });
    }
  }

  // Méthode pour créer un signal de rating
  createRatingSignal(rating: number) {
    return signal(rating);
  }

  getCount(filterType: 'pending' | 'validated' | 'rejected'): number {
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
}
