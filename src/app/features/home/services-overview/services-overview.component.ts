import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-services-overview',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './services-overview.component.html',
  styleUrl: './services-overview.component.css',
})
export class ServicesOverviewComponent {}