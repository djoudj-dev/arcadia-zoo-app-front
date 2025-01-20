import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from 'app/core/auth/services/auth.service';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { Animal } from '../../admin-dashboard/animal-management/model/animal.model';
import { FeedingHistory } from './model/feeding-history.model';
import {
  AnimalState,
  VeterinaryReports,
} from './model/veterinary-reports.model';
import { VeterinaryReportsService } from './service/veterinary-reports.service';
import { AnimalHealthService } from './services/animal-health.service';

@Component({
  selector: 'app-veterinary-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './veterinary-reports.component.html',
})
export class VeterinaryReportsComponent implements OnInit {
  @Input() animalId?: number | null;
  @Output() close = new EventEmitter<void>();

  reportForm!: FormGroup;
  isModalOpen = true;
  activeTab = signal<'feeding' | 'veterinary' | 'new'>('veterinary');
  veterinaryReports = signal<VeterinaryReports[]>([]);
  feedingHistory = signal<FeedingHistory[]>([]);

  // États possibles pour un animal
  animalStates = Object.values(AnimalState);

  // Unités de nourriture possibles
  foodUnits = ['kg', 'g'];

  AnimalState = AnimalState;
  selectedState = signal<AnimalState>(AnimalState.GOOD_HEALTH);
  selectedAnimalId = signal<number | null>(null);

  private readonly fb = inject(FormBuilder);
  private readonly veterinaryReportsService = inject(VeterinaryReportsService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly animalHealthService = inject(AnimalHealthService);

  ngOnInit() {
    this.initForm();
    if (this.animalId) {
      this.selectedAnimalId.set(this.animalId);
      this.loadAnimalDetails();
      this.loadVeterinaryReports();
      this.loadFeedingHistory();
    }
  }

  private initForm() {
    this.reportForm = this.fb.group({
      id_animal: [null, Validators.required],
      animal_name: ['', Validators.required],
      visit_date: [new Date(), Validators.required],
      animal_state: ['', Validators.required],
      recommended_food_type: ['', Validators.required],
      recommended_food_quantity: [
        null,
        [Validators.required, Validators.min(0)],
      ],
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

  private loadVeterinaryReports() {
    if (!this.animalId) return;

    this.veterinaryReportsService
      .getReportsByAnimalId(this.animalId)
      .subscribe({
        next: (reports) => {
          if (reports && reports.length > 0) {
            this.veterinaryReports.set(reports);
          } else {
            this.veterinaryReports.set([]);
          }
        },
        error: (error) => {
          console.error('Erreur lors du chargement des rapports:', error);
          this.toastService.showError(
            'Erreur lors du chargement des rapports vétérinaires'
          );
          this.veterinaryReports.set([]);
        },
      });
  }

  private loadFeedingHistory() {
    if (!this.animalId) return;

    // Implémenter le service pour charger l'historique des repas
    this.feedingHistory.set([]); // À remplacer par l'appel au service
  }

  getStateClass(state: string): string {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-semibold';
    switch (state.toLowerCase()) {
      case AnimalState.GOOD_HEALTH.toLowerCase():
        return `${baseClasses} bg-green-100 text-green-800`;
      case AnimalState.INJURED.toLowerCase():
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case AnimalState.SICK.toLowerCase():
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
    if (this.reportForm.valid) {
      const currentUser = this.authService.user();

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

  updateHealthState() {
    if (!this.selectedAnimalId()) {
      this.toastService.showError('Veuillez sélectionner un animal');
      return;
    }

    this.animalHealthService
      .updateAnimalHealth(this.selectedAnimalId()!, this.selectedState())
      .subscribe({
        next: () => {
          this.toastService.showSuccess('État de santé mis à jour avec succès');
        },
        error: (error) => {
          console.error(
            "Erreur lors de la mise à jour de l'état de santé:",
            error
          );
          this.toastService.showError(
            "Erreur lors de la mise à jour de l'état de santé"
          );
        },
      });
  }
}
