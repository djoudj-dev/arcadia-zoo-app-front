import { Component } from '@angular/core';
import { BorderCardDirective } from '../../../shared/directives/border-card-habitat/border-card-habitat.directive';
import { Habitat } from '../../../core/models/habitat.model';
import { HABITATS } from '../../../core/mocks/habitats-mock.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-habitats-overview',
  standalone: true,
  imports: [BorderCardDirective, RouterLink],
  templateUrl: './habitats-overview.component.html',
})
export class HabitatsOverviewComponent {
  habitats: Habitat[] = HABITATS;
}
