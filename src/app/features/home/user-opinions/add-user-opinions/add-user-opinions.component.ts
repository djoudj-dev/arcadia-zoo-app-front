import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { RateComponent } from '../../../../shared/components/rate/rate.component';
import { ToastService } from '../../../../shared/components/toast/services/toast.service';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import { UserOpinionsService } from '../services/user-opinions.service';

/**
 * Composant pour l'ajout d'avis utilisateur
 * Gère un formulaire avec validation pour la soumission d'avis
 */
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
export class AddUserOpinionsComponent implements OnInit {
  /** Formulaire réactif pour la saisie d'avis */
  opinionForm: FormGroup = new FormGroup({});

  /** Date du jour formatée en YYYY-MM-DD */
  currentDate: string;

  /** Input pour contrôler si la modal est ouverte */
  @Input() isOpen = false;

  /** Event emitter pour notifier quand un avis est ajouté */
  @Output() opinionAdded = new EventEmitter<void>();

  @Output() closeModal = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private userOpinionsService: UserOpinionsService,
    private toastService: ToastService
  ) {
    this.currentDate = new Date().toISOString().split('T')[0];
  }

  /**
   * Initialise le formulaire avec les validations
   */
  ngOnInit() {
    this.initForm();
  }

  /**
   * Initialise le formulaire avec les validations
   */
  private initForm(): void {
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
  }

  /**
   * Getters pour vérifier les erreurs des champs du formulaire
   */
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

  /**
   * Gère la soumission du formulaire
   */
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
          this.opinionForm.reset();
          this.opinionAdded.emit();
          setTimeout(() => {
            this.closeModal.emit();
          }, 3000);
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

  onClose() {
    this.closeModal.emit();
  }
}
