import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-service-management',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './service-management.component.html',
  styleUrl: './service-management.component.css',
})
export class ServiceManagementComponent {}
