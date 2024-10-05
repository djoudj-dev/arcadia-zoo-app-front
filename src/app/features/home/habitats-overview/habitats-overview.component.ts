import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BorderCardDirective } from '../../../shared/directives/border-card.directive';

@Component({
  selector: 'app-habitats-overview',
  standalone: true,
  imports: [ButtonComponent, BorderCardDirective],
  templateUrl: './habitats-overview.component.html',
})
export class HabitatsOverviewComponent {}
