import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-animal-management',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './animal-management.component.html',
  styleUrl: './animal-management.component.css',
})
export class AnimalManagementComponent {}
