import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from 'app/shared/components/button/button.component';

@Component({
  selector: 'app-add-user-opinions',
  templateUrl: './add-user-opinions.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
})
export class AddUserOpinionsComponent implements OnInit {
  opinionForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.opinionForm = this.fb.group({
      name: ['', Validators.required],
      opinion: ['', [Validators.required, Validators.minLength(10)]],
      rating: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.opinionForm.valid) {
      console.log(this.opinionForm.value);
    }
  }
}
