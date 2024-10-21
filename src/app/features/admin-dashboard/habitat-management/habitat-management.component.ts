import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-habitat-management',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './habitat-management.component.html',
  styleUrl: './habitat-management.component.css',
})
export class HabitatManagementComponent {}
