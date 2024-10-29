import { Component, OnInit, signal } from '@angular/core';
import { Animal } from '../../../core/models/animal.model';
import { AnimalService } from '../../animal/service/animal.service';
import { BorderCardAnimalDirective } from '../../../shared/directives/border-card-animal/border-card-animal.directive';
import { RouterLink } from '@angular/router';
import { RandomAnimalsDirective } from '../../../shared/directives/random-animals/random-animals.directive';

@Component({
  selector: 'app-animals-overview',
  standalone: true,
  imports: [BorderCardAnimalDirective, RouterLink, RandomAnimalsDirective],
  templateUrl: './animals-overview.component.html',
})
export class AnimalsOverviewComponent implements OnInit {
  animals = signal<Animal[]>([]); // Utilisation de signal pour les animaux
  displayedAnimals = signal<Animal[]>([]); // Utilisation de signal pour les animaux affichés
  isLoading = signal<boolean>(true); // Utilisation de signal pour le chargement

  constructor(private animalService: AnimalService) {}

  ngOnInit() {
    // Récupérer les animaux via le service
    this.animalService.getAnimals().subscribe({
      next: (data) => {
        this.animals.set(data);
        this.isLoading.set(false); // Désactiver le chargement une fois les données récupérées
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des animaux :', err);
        this.isLoading.set(false); // En cas d'erreur, désactiver le chargement
      },
    });
  }

  // Méthode pour mettre à jour la liste d'animaux affichés
  onUpdateDisplayedAnimals(updatedAnimals: Animal[]) {
    this.displayedAnimals.set(updatedAnimals); // Utilisation de signal pour mise à jour réactive
  }

  // Log l'ID de l'animal cliqué
  logAnimalId(id: number) {
    console.log('Clicked animal ID:', id);
  }
}
