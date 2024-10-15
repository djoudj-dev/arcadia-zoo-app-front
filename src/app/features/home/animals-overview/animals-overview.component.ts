import { Component, OnInit } from '@angular/core';
import { Animal } from '../../../core/models/animal.model';
import { BorderCardAnimalDirective } from '../../../shared/directives/border-card-animal/border-card-animal.directive';
import { RouterLink } from '@angular/router';
import { AnimalService } from '../../animal/service/animal.service';

@Component({
  selector: 'app-animals-overview',
  standalone: true,
  imports: [BorderCardAnimalDirective, RouterLink],
  templateUrl: './animals-overview.component.html',
})
export class AnimalsOverviewComponent implements OnInit {
  animals: Animal[] = [];
  displayedAnimals: Animal[] = [];

  constructor(private animalService: AnimalService) {}

  ngOnInit() {
    // Récupérer les animaux depuis le service
    this.animalService.getAnimals().subscribe((data) => {
      this.animals = data;
      this.updateDisplayedAnimals(); // Met à jour les animaux affichés au chargement
      setInterval(() => {
        this.updateDisplayedAnimals(); // Mise à jour toutes les 5 secondes
      }, 5000);
    });
  }

  // Met à jour les animaux affichés en prenant un sous-ensemble aléatoire
  updateDisplayedAnimals() {
    this.displayedAnimals = this.animals
      .sort(() => 0.5 - Math.random()) // Mélange aléatoire des animaux
      .slice(0, 4); // Sélectionne les 4 premiers animaux après le mélange
  }

  // Log l'ID de l'animal cliqué
  logAnimalId(id: number) {
    console.log('Clicked animal ID:', id);
  }
}
