import { Component } from '@angular/core';
import { BorderCardDirective } from '../../../shared/directives/border-card-habitat/border-card-habitat.directive';

@Component({
  selector: 'app-habitats-overview',
  standalone: true,
  imports: [BorderCardDirective],
  templateUrl: './habitats-overview.component.html',
})
export class HabitatsOverviewComponent {}
