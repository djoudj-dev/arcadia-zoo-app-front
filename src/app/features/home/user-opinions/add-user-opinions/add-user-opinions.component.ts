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
  opinionForm: FormGroup;

  /** Date du jour formatée en YYYY-MM-DD */
  currentDate: string;

  /** Input pour contrôler si la modal est ouverte */
  @Input() isOpen = false;

  /** Event emitter pour notifier quand un avis est ajouté */
  @Output() opinionAdded = new EventEmitter<void>();

  /** Event emitter pour fermer la modal */
  @Output() closeModal = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private userOpinionsService: UserOpinionsService,
    private toastService: ToastService
  ) {
    this.currentDate = new Date().toISOString().split('T')[0];
    this.opinionForm = this.fb.group({}); // Initialisation requise
  }

  /** Initialise le formulaire avec les validations */
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
      date: ['', [Validators.required, this.futureDateValidator]],
    });
  }

  /**
   * Validateur personnalisé pour empêcher les dates futures
   */
  private futureDateValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    const selected = new Date(selectedDate.toDateString());
    const current = new Date(today.toDateString());
    return selected > current ? { futureDate: true } : null;
  }

  /** Gère la soumission du formulaire */
  onSubmit(): void {
    if (this.opinionForm.valid) {
      const userOpinions = {
        ...this.opinionForm.value,
        date: new Date().toISOString().split('T')[0],
      };
      this.userOpinionsService.addUserOpinions(userOpinions).subscribe({
        next: () => {
          this.toastService.showSuccess(
            'Votre avis a été envoyé avec succès ! Merci de votre contribution.',
            2500
          );
          this.opinionForm.reset();
          this.opinionAdded.emit();
          setTimeout(() => this.closeModal.emit(), 2500);
        },
        error: (error) => {
          console.error("Erreur lors de l'envoi de l'avis", error);
          this.toastService.showError(
            "Une erreur est survenue lors de l'envoi de votre avis. Veuillez réessayer."
          );
        },
      });
    }
  }

  /** Ferme la modal */
  onClose() {
    this.closeModal.emit();
  }
}
