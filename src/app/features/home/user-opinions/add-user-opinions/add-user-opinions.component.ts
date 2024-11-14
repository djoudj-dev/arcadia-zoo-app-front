import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { Subscription } from 'rxjs';
import { RateComponent } from '../../../../shared/components/rate/rate.component';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { ModalService } from '../services/modal.service';
import { UserOpinionsService } from '../services/user-opinions.service';

@Component({
  selector: 'app-add-user-opinions',
  standalone: true,
  templateUrl: './add-user-opinions.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    RateComponent,
    ToastComponent,
  ],
})
export class AddUserOpinionsComponent implements OnInit, OnDestroy {
  opinionForm: FormGroup = new FormGroup({});
  private modalSubscription: Subscription | null = null;
  currentDate: string;

  constructor(
    private fb: FormBuilder,
    private userOpinionsService: UserOpinionsService,
    private modalService: ModalService,
    private toastService: ToastService
  ) {
    this.currentDate = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    this.opinionForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-ZÀ-ÿ\s'-]*$/),
        ],
      ],
      message: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
          Validators.pattern(/^[a-zA-ZÀ-ÿ0-9\s.,!?'"()\-]*$/),
        ],
      ],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      date: [
        '',
        [
          Validators.required,
          (control: AbstractControl): ValidationErrors | null => {
            const date = new Date(control.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date > today ? { futureDate: true } : null;
          },
        ],
      ],
    });

    // Souscrire au modal
    this.modalSubscription = this.modalService.isOpen$.subscribe((isOpen) => {
      if (!isOpen) {
        this.opinionForm.reset();
      }
    });
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
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

  get dateErrors() {
    const control = this.opinionForm.get('date');
    return control?.errors && control.touched;
  }

  onSubmit(): void {
    if (this.opinionForm.valid) {
      const userOpinions = {
        ...this.opinionForm.value,
        date: new Date().toISOString().split('T')[0],
      };
      this.userOpinionsService.addUserOpinions(userOpinions).subscribe({
        next: (response) => {
          console.log('Avis ajouté avec succès:', response);
          this.toastService.showSuccess(
            'Votre avis a été envoyé avec succès ! Merci de votre contribution.'
          );
          this.modalService.closeWithDelay();
          this.userOpinionsService.getUserOpinions().subscribe();
        },
        error: (error) => {
          console.error("Erreur lors de l'envoi de l'avis au backend", error);
          this.toastService.showError(
            "Une erreur est survenue lors de l'envoi de votre avis. Veuillez réessayer ou contacter l'administrateur si le problème persiste."
          );
        },
      });
    }
  }

  closeModal(): void {
    this.modalService.close();
  }
}
