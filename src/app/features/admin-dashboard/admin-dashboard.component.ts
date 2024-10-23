import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HabitatsDashboardComponent } from './habitats-dashboard/habitats-dashboard.component';
import { AuthService } from '../../core/auth/auth.service';

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
export class DashboardComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    console.log('Token récupéré pour Dashboard:', token); // Vérifiez si le token est disponible
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
