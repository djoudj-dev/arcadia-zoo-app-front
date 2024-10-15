import { Component, OnInit } from '@angular/core';
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
  animals: Animal[] = [];
  displayedAnimals: Animal[] = [];

  constructor(private animalService: AnimalService) {}

  ngOnInit() {
    // Récupérer les animaux via le service
    this.animalService.getAnimals().subscribe((data) => {
      this.animals = data;
    });
  }

  // Méthode pour mettre à jour la liste d'animaux affichés
  onUpdateDisplayedAnimals(updatedAnimals: Animal[]) {
    this.displayedAnimals = updatedAnimals;
  }

  // Log l'ID de l'animal cliqué
  logAnimalId(id: number) {
    console.log('Clicked animal ID:', id);
  }
}
