import {
  Directive,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { Animal } from '../../../features/dashboard/admin-dashboard/animal-management/model/animal.model';

@Directive({
  selector: '[appRandomAnimals]',
  standalone: true,
})
export class RandomAnimalsDirective implements OnInit, OnDestroy {
  @Input() animals: Animal[] = [];
  @Input() count: number = 4; // Par défaut, afficher 4 animaux
  @Output() updateAnimals = new EventEmitter<Animal[]>(); // Émettre la liste d'animaux mis à jour

  private intervalSubscription!: Subscription;

  ngOnInit(): void {
    // Mise à jour initiale des animaux affichés
    this.updateDisplayedAnimals();

    // Actualisation toutes les 5 secondes
    this.intervalSubscription = interval(5000).subscribe(() => {
      this.updateDisplayedAnimals();
    });
  }

  ngOnDestroy(): void {
    // Nettoyer l'abonnement à l'intervalle pour éviter les fuites de mémoire
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  private updateDisplayedAnimals() {
    // Mélange aléatoire des animaux et sélection des 'count' premiers
    const shuffledAnimals = [...this.animals].sort(() => 0.5 - Math.random());
    const selectedAnimals = shuffledAnimals.slice(0, this.count);
    this.updateAnimals.emit(selectedAnimals); // Émettre les animaux sélectionnés
  }
}
