import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HabitatsDashboardComponent } from './habitats-dashboard/habitats-dashboard.component';
import { TokenService } from '../../core/token/token.service';
import { StatsComponent } from './stats/stats.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ButtonComponent,
    FormsModule,
    RouterOutlet,
    RouterLink,
    HabitatsDashboardComponent,
    StatsComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
})
export class DashboardComponent {
  constructor(private router: Router, private tokenService: TokenService) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
