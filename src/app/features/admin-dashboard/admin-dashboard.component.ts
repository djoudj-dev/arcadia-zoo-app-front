import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonComponent, FormsModule, RouterOutlet],
  templateUrl: './admin-dashboard.component.html',
})
export class DashboardComponent {}
