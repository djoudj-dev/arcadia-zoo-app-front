import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-form-review',
  standalone: true,
  imports: [FormsModule, ButtonComponent],
  templateUrl: './form-review.component.html',
  styleUrl: './form-review.component.css',
})
export class FormReviewComponent {}
