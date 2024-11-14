import { DatePipe } from '@angular/common';
import { Component, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { RateComponent } from '../../../../shared/components/rate/rate.component';
import { AddUserOpinionsComponent } from '../add-user-opinions/add-user-opinions.component';
import { UserOpinions } from '../models/user-opinions.model';
import { ModalService } from '../services/modal.service';
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
export class UserOpinionsComponent implements OnDestroy {
  /** Signal indiquant si la notation est en lecture seule */
  readonly isReadOnly = signal<boolean>(true);

  /** Signal contenant la liste des avis utilisateurs */
  readonly userOpinions = signal<UserOpinions[]>([]);

  /** Signal pour l'index de l'avis actuellement affiché */
  readonly currentUserOpinionsIndex = signal<number>(0);

  /** Signal pour la note de l'avis actuellement affiché */
  readonly currentRating = signal<number>(0);

  /** Signal pour contrôler l'état d'ouverture de la modal */
  isModalOpen = signal<boolean>(false);

  /** Souscription au service modal */
  private modalSubscription: Subscription;

  constructor(
    private modalService: ModalService,
    private userOpinionsService: UserOpinionsService
  ) {
    // Charge les avis utilisateurs au démarrage
    this.userOpinionsService.getUserOpinions().subscribe((userOpinions) => {
      this.userOpinions.set(userOpinions);
      this.updateCurrentRating();
    });

    // Synchronise l'état de la modal avec le service
    this.modalSubscription = this.modalService.isOpen$.subscribe((isOpen) => {
      this.isModalOpen.set(isOpen);
    });
  }

  /**
   * Nettoie la souscription à la modal lors de la destruction du composant
   */
  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

  /**
   * Met à jour la note affichée en fonction de l'avis actuellement sélectionné
   */
  private updateCurrentRating(): void {
    const opinions = this.userOpinions();
    const currentIndex = this.currentUserOpinionsIndex();
    if (opinions[currentIndex]) {
      this.currentRating.set(opinions[currentIndex].rating);
    } else {
      this.currentRating.set(0);
    }
  }

  /**
   * Change l'avis affiché en fonction de la direction
   * @param direction 'previous' pour afficher l'avis précédent, 'next' pour le suivant
   */
  changeUserOpinions(direction: 'previous' | 'next'): void {
    const userOpinions = this.userOpinions();
    if (direction === 'previous' && this.currentUserOpinionsIndex() > 0) {
      this.currentUserOpinionsIndex.set(this.currentUserOpinionsIndex() - 1);
      this.updateCurrentRating();
    } else if (
      direction === 'next' &&
      this.currentUserOpinionsIndex() < userOpinions.length - 1
    ) {
      this.currentUserOpinionsIndex.set(this.currentUserOpinionsIndex() + 1);
      this.updateCurrentRating();
    }
  }

  /**
   * Ouvre la modal d'ajout d'avis via le service
   */
  openModal() {
    this.modalService.open();
  }

  /**
   * Ferme la modal d'ajout d'avis via le service
   */
  closeModal() {
    this.modalService.close();
  }
}
