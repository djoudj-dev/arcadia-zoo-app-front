import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HabitatsDashboardComponent } from './habitats-dashboard/habitats-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ButtonComponent,
    FormsModule,
    RouterOutlet,
    RouterLink,
    HabitatsDashboardComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
})
export class DashboardComponent {
  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
