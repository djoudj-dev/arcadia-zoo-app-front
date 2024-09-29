import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-habitats-overview',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './habitats-overview.component.html',
  styleUrl: './habitats-overview.component.css',
})
export class HabitatsOverviewComponent {}
