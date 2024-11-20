import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from 'app/core/auth/services/auth.service';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { ToastComponent } from 'app/shared/components/toast/toast.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Animal } from '../../admin-dashboard/animal-management/model/animal.model';
import { AnimalState } from './model/veterinary-reports.model';
import { VeterinaryReportsService } from './service/veterinary-reports.service';

@Component({
  selector: 'app-veterinary-reports',
  templateUrl: './veterinary-reports.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastComponent, ButtonComponent],
})
export class VeterinaryReportsComponent implements OnInit {
  @Input() animalId?: number | null;
  @Output() close = new EventEmitter<void>();

  reportForm!: FormGroup;
  isModalOpen = true;

  // États possibles pour un animal
  animalStates = Object.values(AnimalState);

  // Unités de nourriture possibles
  foodUnits = ['kg', 'g'];

  constructor(
    private fb: FormBuilder,
    private veterinaryReportsService: VeterinaryReportsService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    console.log('VeterinaryReportsComponent initialized');
    console.log('Modal state:', this.isModalOpen);
    this.initForm();
    if (this.animalId) {
      this.loadAnimalDetails();
    }
  }

  private initForm() {
    this.reportForm = this.fb.group({
      id_animal: ['', Validators.required],
      animal_name: ['', Validators.required],
      visit_date: ['', Validators.required],
      animal_state: ['', Validators.required],
      recommended_food_type: ['', Validators.required],
      recommended_food_quantity: ['', [Validators.required, Validators.min(0)]],
      food_unit: ['', Validators.required],
      additional_details: [''],
    });
  }

  private loadAnimalDetails() {
    this.veterinaryReportsService.fetchAnimalDetails(this.animalId!).subscribe({
      next: (animal: Animal | undefined) => {
        if (animal) {
          this.reportForm.patchValue({
            id_animal: animal.id_animal,
            animal_name: animal.name,
            animal_photo: animal.images,
          });
        }
      },
      error: (error: Error) =>
        console.error("Erreur lors de la récupération de l'animal:", error),
    });
  }

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
    if (this.reportForm.valid) {
      const currentUser = this.authService.currentUserSignal();

      if (!currentUser?.id) {
        console.error('Utilisateur non connecté');
        return;
      }

      const reportData = {
        ...this.reportForm.value,
        id_user: currentUser.id,
        user_name: currentUser.name,
        animal_state: this.reportForm.value.animal_state,
      };

      this.veterinaryReportsService.createReport(reportData).subscribe({
        next: (response) => {
          console.log('Rapport créé avec succès', response);
          const closePromise = new Promise<void>((resolve) => {
            this.toastService.showSuccess(
              'Rapport vétérinaire enregistré avec succès'
            );
            setTimeout(resolve, 3000);
          });

          closePromise.then(() => {
            this.closeModal();
          });
        },
        error: () => {
          this.toastService.showError(
            "Erreur lors de l'enregistrement du rapport"
          );
        },
      });
    }
  }
}
