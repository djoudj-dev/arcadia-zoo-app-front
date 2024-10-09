import { Component } from '@angular/core';
import { ANIMALS } from '../../../reviews/mocks/animals-mock.component';
import { Animal } from '../../../core/models/animals.model';
import { BorderCardAnimalDirective } from '../../../shared/directives/border-card-animal/border-card-animal.directive';

@Component({
  selector: 'app-animals-overview',
  standalone: true,
  imports: [BorderCardAnimalDirective],
  templateUrl: './animals-overview.component.html',
})
export class AnimalsOverviewComponent {
  animals: Animal[] = ANIMALS;
  displayedAnimals: Animal[] = [];

  ngOnInit() {
    this.updateDisplayedAnimals();
    setInterval(() => {
      this.updateDisplayedAnimals();
    }, 5000);
  }

  updateDisplayedAnimals() {
    this.displayedAnimals = this.animals
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
  }
}
