import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { Review } from '../../core/models/review.model';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { RateComponent } from '../../shared/components/rate/rate.component';
import { AddReviewComponent } from '../add-review/add-review.component';
import { ModalService } from '../services/modal.service';
import { ReviewService } from '../services/review.service';

@Component({
  selector: 'app-review', // Définition du sélecteur HTML du composant
  templateUrl: './review.component.html', // Chemin vers le fichier template HTML du composant
  standalone: true, // Le composant est autonome, pas besoin de NgModule pour être utilisé
  imports: [
    // Importation des composants et pipes utilisés dans le template
    RateComponent,
    ButtonComponent,
    DatePipe,
    AddReviewComponent,
    AsyncPipe,
  ],
})
export class ReviewComponent {
  // Utilisation d'un setter pour l'input 'stars' afin de garantir qu'il a une valeur par défaut
  @Input() set stars(value: number[]) {
    this._stars = value || [1, 2, 3, 4, 5]; // Si aucune valeur n'est fournie, on affecte un tableau de 5 étoiles par défaut
  }
  get stars(): number[] {
    return this._stars; // Getter pour accéder à la valeur des étoiles
  }

  // Utilisation d'un setter pour l'input 'rating' pour gérer une valeur par défaut de 0
  @Input() set rating(value: number) {
    this._rating = value ?? 0; // Si la valeur est `null` ou `undefined`, on assigne la valeur 0
  }
  get rating(): number {
    return this._rating; // Getter pour accéder à la note actuelle
  }

  // Observable contenant les avis des utilisateurs
  reviews = signal<Review[]>([]);
  // Index de l'avis actuellement affiché
  currentReviewIndex = signal<number>(0);

  // Propriétés privées pour les étoiles et la note, initialisées avec des valeurs par défaut
  private _stars: number[] = [1, 2, 3, 4, 5]; // Valeur par défaut de 5 étoiles
  private _rating = 0; // Note par défaut à 0

  // Injection des services ModalService et ReviewService dans le constructeur
  constructor(
    private modalService: ModalService, // Service pour la gestion de la modal
    private reviewService: ReviewService // Service pour récupérer les avis
  ) {
    // S'abonner à l'Observable et mettre à jour le signal
    this.reviewService.getReviews().subscribe((reviews) => {
      this.reviews.set(reviews);
    });
  }

  // Méthode pour naviguer entre les avis. 'direction' peut être 'previous' ou 'next'
  changeReview(direction: 'previous' | 'next'): void {
    const reviews = this.reviews();
    if (direction === 'previous' && this.currentReviewIndex() > 0) {
      this.currentReviewIndex.set(this.currentReviewIndex() - 1);
    } else if (
      direction === 'next' &&
      this.currentReviewIndex() < reviews.length - 1
    ) {
      this.currentReviewIndex.set(this.currentReviewIndex() + 1);
    }
  }

  // Méthode pour ouvrir une modal via le ModalService
  openModal() {
    this.modalService.openModal(); // Appelle la méthode d'ouverture de modal du service
  }
}
