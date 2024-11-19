import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { RateComponent } from '../../../../shared/components/rate/rate.component';
import { ToastService } from '../../../../shared/components/toast/services/toast.service';
import { AddUserOpinionsComponent } from '../add-user-opinions/add-user-opinions.component';
import { UserOpinion } from '../models/user-opinions.model';
import { UserOpinionsService } from '../services/user-opinions.service';

/**
 * Composant d'affichage des avis utilisateurs
 * Permet de naviguer entre les différents avis et d'en ajouter de nouveaux
 */
@Component({
  selector: 'app-user-opinions',
  templateUrl: './user-opinions.component.html',
  standalone: true,
  imports: [
    RateComponent,
    ButtonComponent,
    DatePipe,
    ModalComponent,
    AddUserOpinionsComponent,
  ],
})
export class UserOpinionsComponent implements OnInit, OnDestroy {
  /** Signal indiquant si la notation est en lecture seule */
  readonly isReadOnly = signal<boolean>(true);

  /** Signal contenant la liste des avis utilisateurs */
  readonly userOpinions = signal<UserOpinion[]>([]);

  /** Signal pour l'index de l'avis actuellement affiché */
  readonly currentUserOpinionsIndex = signal<number>(0);

  /** Signal pour la note de l'avis actuellement affiché */
  readonly currentRating = signal<number>(0);

  /** Signal pour contrôler l'état de chargement */
  readonly isLoading = signal<boolean>(true);

  /** Signal pour contrôler l'état d'erreur */
  readonly hasError = signal<boolean>(false);

  /** Signal pour contrôler l'état d'ouverture de la modal */
  readonly isModalOpen = signal<boolean>(false);

  /** Souscription au service user opinions */
  private opinionsSubscription?: Subscription;

  constructor(
    private userOpinionsService: UserOpinionsService,
    private toastService: ToastService
  ) {}

  /** Initialise le composant en chargeant les avis */
  ngOnInit() {
    this.loadUserOpinions();
  }

  /**
   * Charge les avis utilisateurs depuis le service
   */
  public loadUserOpinions() {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.opinionsSubscription = this.userOpinionsService
      .getUserOpinions()
      .subscribe({
        next: (opinions) => {
          this.userOpinions.set(opinions);
          this.updateCurrentRating();
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Erreur lors du chargement des avis:', error);
          this.hasError.set(true);
          this.isLoading.set(false);
          this.toastService.showError(
            'Impossible de charger les avis utilisateurs'
          );
        },
      });
  }

  /** Nettoie la souscription lors de la destruction du composant */
  ngOnDestroy() {
    this.opinionsSubscription?.unsubscribe();
  }

  /**
   * Met à jour la note affichée en fonction de l'avis actuellement sélectionné
   */
  private updateCurrentRating(): void {
    const opinions = this.userOpinions();
    const currentIndex = this.currentUserOpinionsIndex();
    if (opinions[currentIndex]) {
      this.currentRating.set(opinions[currentIndex].rating);
    }
  }

  /**
   * Change l'avis affiché en fonction de la direction
   * @param direction 'previous' pour l'avis précédent, 'next' pour le suivant
   */
  changeUserOpinions(direction: 'previous' | 'next'): void {
    const currentIndex = this.currentUserOpinionsIndex();
    const maxIndex = this.userOpinions().length - 1;

    if (direction === 'previous' && currentIndex > 0) {
      this.currentUserOpinionsIndex.set(currentIndex - 1);
    } else if (direction === 'next' && currentIndex < maxIndex) {
      this.currentUserOpinionsIndex.set(currentIndex + 1);
    }
    this.updateCurrentRating();
  }

  /** Ouvre la modal d'ajout d'avis */
  openModal() {
    this.isModalOpen.set(true);
  }

  /** Ferme la modal d'ajout d'avis */
  closeModal() {
    this.isModalOpen.set(false);
  }
}
