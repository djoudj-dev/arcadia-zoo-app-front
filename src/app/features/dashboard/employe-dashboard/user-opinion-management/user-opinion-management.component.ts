import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserOpinion } from 'app/features/home/user-opinions/models/user-opinions.model';
import { UserOpinionsService } from 'app/features/home/user-opinions/services/user-opinions.service';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { RateComponent } from 'app/shared/components/rate/rate.component';
import { ToastService } from 'app/shared/components/toast/services/toast.service';

@Component({
  selector: 'app-user-opinion-management',
  standalone: true,
  imports: [CommonModule, ButtonComponent, RateComponent],
  templateUrl: './user-opinion-management.component.html',
})
export class UserOpinionManagementComponent implements OnInit {
  // Liste de tous les avis
  allOpinions = signal<UserOpinion[]>([]);

  // Liste des avis filtrés (pour l'affichage)
  opinions = signal<UserOpinion[]>([]);

  // Indicateur de chargement
  isLoading = signal<boolean>(true);

  // Filtre actuel (par défaut : "en attente")
  currentFilter = signal<'pending' | 'validated' | 'rejected'>('pending');

  // Signal pour le mode lecture seule
  readOnlySignal = signal<boolean>(true);

  constructor(
    private userOpinionsService: UserOpinionsService,
    private toastService: ToastService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Écouter les changements de route
    this.route.parent?.url.subscribe(() => {
      const currentPath = this.route.snapshot.url[0]?.path;
      if (currentPath) {
        this.currentFilter.set(
          currentPath as 'pending' | 'validated' | 'rejected'
        );
        this.loadAllOpinions();
      }
    });
  }

  // Charger tous les avis
  loadAllOpinions(): void {
    this.isLoading.set(true);
    this.userOpinionsService.getAllUserOpinions().subscribe({
      next: (opinions) => {
        this.allOpinions.set(opinions);
        this.filterOpinions();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des avis:', error);
        this.toastService.showError('Erreur lors du chargement des avis');
        this.isLoading.set(false);
      },
    });
  }

  // Filtrer les avis selon le filtre actuel
  filterOpinions(): void {
    const filtered = this.allOpinions().filter((opinion) => {
      switch (this.currentFilter()) {
        case 'pending':
          return !opinion.validated && !opinion.rejected;
        case 'validated':
          return opinion.validated;
        case 'rejected':
          return opinion.rejected;
        default:
          return true;
      }
    });
    this.opinions.set(filtered);
  }

  // Mise à jour du filtre actuel
  changeFilter(filter: 'pending' | 'validated' | 'rejected'): void {
    this.currentFilter.set(filter);
    this.filterOpinions();
  }

  // Méthodes pour compter les avis par catégorie
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

  // Méthode pour créer un signal de rating
  createRatingSignal(rating: number) {
    return signal<number>(rating);
  }

  validateOpinion(opinion: UserOpinion): void {
    if (!opinion?._id) return;

    this.userOpinionsService.validateUserOpinions(opinion._id).subscribe({
      next: () => {
        this.toastService.showSuccess('Avis validé avec succès');
        this.loadAllOpinions();
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
        this.loadAllOpinions();
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
          this.loadAllOpinions();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.toastService.showError('Erreur lors de la suppression');
        },
      });
    }
  }
}
