import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { RateComponent } from '../../../../shared/components/rate/rate.component';

@Component({
  selector: 'app-add-user-opinions',
  standalone: true,
  templateUrl: './add-user-opinions.component.html',
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, RateComponent],
})
export class AddUserOpinionsComponent implements OnInit {
  opinionForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.opinionForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-ZÀ-ÿ\s'-]*$/), // Lettres, accents, espaces, tirets et apostrophes
        ],
      ],
      opinion: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
          Validators.pattern(/^[a-zA-ZÀ-ÿ0-9\s.,!?'"()\-]*$/), // Caractères basiques + ponctuation
        ],
      ],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  // Getters pour faciliter l'accès aux erreurs dans le template
  get nameErrors() {
    const control = this.opinionForm.get('name');
    return control?.errors && control.touched;
  }

  get opinionErrors() {
    const control = this.opinionForm.get('opinion');
    return control?.errors && control.touched;
  }

  onSubmit(): void {
    if (this.opinionForm.valid) {
      console.log(this.opinionForm.value);
    }
  }
}
