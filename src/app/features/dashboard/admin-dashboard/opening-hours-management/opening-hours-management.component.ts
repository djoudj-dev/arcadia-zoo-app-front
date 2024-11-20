import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { catchError, EMPTY, firstValueFrom, switchMap, tap } from 'rxjs';
import { ToastService } from '../../../../shared/components/toast/services/toast.service';
import {
  OpeningHours,
  OpeningHoursFormData,
  ParkStatus,
} from './models/opening-hours.model';
import { OpeningHoursService } from './services/opening-hours.service';

/**
 * Composant de gestion des horaires d'ouverture
 * Permet à l'administrateur de modifier les horaires et le statut du parc
 */
@Component({
  selector: 'app-opening-hours-management',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './opening-hours-management.component.html',
})
export class OpeningHoursManagementComponent implements OnInit {
  /** Signal pour les horaires */
  openingHours = signal<OpeningHours[]>([]);

  /** Signal pour le statut du parc */
  parkStatus = signal<ParkStatus>({
    isOpen: true,
    message: '',
  });

  /** Formulaire pour les horaires */
  hoursForm = new FormGroup({
    weekdayHours: new FormControl('', Validators.required),
    weekendHours: new FormControl('', Validators.required),
    isWeekdayOpen: new FormControl(true),
    isWeekendOpen: new FormControl(true),
    parkStatus: new FormControl(true),
    statusMessage: new FormControl(''),
  });

  /** ID des horaires */
  openingHoursId = signal<string>('1');

  constructor(
    private fb: FormBuilder,
    private openingHoursService: OpeningHoursService,
    private toastService: ToastService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Charger les horaires initiaux
    this.openingHoursService.getCurrentOpeningHours().subscribe({
      next: (hours) => {
        if (hours) {
          this.openingHours.set([hours]);
          this.parkStatus.set({
            isOpen: hours.parkStatus,
            message: hours.statusMessage || '',
          });
          if (hours._id) {
            this.openingHoursId.set(hours._id);
          }
          this.loadCurrentHours();
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des horaires:', error);
        this.toastService.showError('Erreur lors du chargement des horaires');
      },
    });
  }

  /**
   * Crée le formulaire pour les horaires
   */
  private initForm(): void {
    this.hoursForm = this.fb.group({
      weekdayHours: ['', Validators.required],
      weekendHours: ['', Validators.required],
      isWeekdayOpen: [true],
      isWeekendOpen: [true],
      parkStatus: [true],
      statusMessage: [''],
    });
  }

  /**
   * Charge les horaires actuels
   */
  private loadCurrentHours(): void {
    console.log('Début de loadCurrentHours');
    const currentHours = this.openingHoursService.openingHours();
    console.log('Horaires actuels récupérés:', currentHours);

    if (currentHours && currentHours.length > 0) {
      const hours = currentHours[0];

      const weekdaySchedule = hours.openingHours.find((h) =>
        h.days.includes('Lundi')
      );
      const weekendSchedule = hours.openingHours.find((h) =>
        h.days.includes('Samedi')
      );

      this.hoursForm.patchValue({
        weekdayHours: weekdaySchedule?.hours || '',
        weekendHours: weekendSchedule?.hours || '',
        isWeekdayOpen: weekdaySchedule?.isOpen ?? true,
        isWeekendOpen: weekendSchedule?.isOpen ?? true,
        parkStatus: hours.parkStatus,
        statusMessage: hours.statusMessage || '',
      });
    }
  }

  /**
   * Met à jour les horaires
   */
  async updateHours() {
    console.log('Début de updateHours');
    try {
      let correctId: string;
      try {
        correctId = await this.openingHoursService.getOpeningHoursId();
        console.log('ID récupéré:', correctId);
      } catch {
        correctId = '1';
        console.log("Utilisation de l'ID par défaut:", correctId);
      }

      const formData: OpeningHoursFormData = {
        weekdayHours: this.hoursForm.get('weekdayHours')?.value ?? '',
        weekendHours: this.hoursForm.get('weekendHours')?.value ?? '',
        isWeekdayOpen: this.hoursForm.get('isWeekdayOpen')?.value ?? true,
        isWeekendOpen: this.hoursForm.get('isWeekendOpen')?.value ?? true,
        parkStatus: this.hoursForm.get('parkStatus')?.value ?? true,
        statusMessage: this.hoursForm.get('statusMessage')?.value ?? '',
      };

      console.log('FormData préparé:', formData);

      const response = await firstValueFrom(
        this.openingHoursService.updateOpeningHours(correctId, formData)
      );

      console.log('Résultat de la mise à jour:', response);

      if (response) {
        const updatedHours = Array.isArray(response) ? response : [response];
        this.openingHours.set(updatedHours);
        this.loadCurrentHours();
        this.toastService.showSuccess('Horaires mis à jour avec succès');
      }
    } catch (error) {
      console.error('Erreur complète lors de la mise à jour:', error);
      this.toastService.showError('Erreur lors de la mise à jour des horaires');
    }
  }

  /**
   * Sauvegarde les modifications des horaires
   */
  saveChanges(): void {
    console.log('Méthode saveChanges() appelée');
    console.log('État du formulaire:', this.hoursForm.value);
    console.log('ID des horaires:', this.openingHoursId());

    if (!this.openingHoursId()) {
      this.toastService.showError('ID des horaires non défini');
      return;
    }

    if (this.hoursForm.valid) {
      const formData: OpeningHoursFormData = {
        weekdayHours: this.hoursForm.get('weekdayHours')?.value ?? '',
        weekendHours: this.hoursForm.get('weekendHours')?.value ?? '',
        isWeekdayOpen: this.hoursForm.get('isWeekdayOpen')?.value ?? true,
        isWeekendOpen: this.hoursForm.get('isWeekendOpen')?.value ?? true,
        parkStatus: this.hoursForm.get('parkStatus')?.value ?? true,
        statusMessage: this.hoursForm.get('statusMessage')?.value ?? '',
      };

      this.openingHoursService
        .updateOpeningHours(this.openingHoursId(), formData)
        .pipe(
          tap(() => console.log('Mise à jour des horaires réussie')),
          catchError((error) => {
            console.error('Erreur détaillée:', error);
            this.toastService.showError(
              `Erreur lors de la mise à jour des horaires: ${error.message}`
            );
            return EMPTY;
          }),
          switchMap(() => {
            const parkStatus: ParkStatus = {
              isOpen: formData.parkStatus,
              message: formData.statusMessage || '',
            };
            return this.openingHoursService.updateParkStatus(parkStatus);
          })
        )
        .subscribe({
          next: () => {
            this.toastService.showSuccess(
              'Modifications enregistrées avec succès'
            );
            this.loadCurrentHours();
          },
          error: (error) => {
            console.error('Erreur lors de la sauvegarde:', error);
            this.toastService.showError(
              'Erreur lors de la sauvegarde des modifications'
            );
          },
        });
    } else {
      console.log('Formulaire invalide:', this.hoursForm.errors);
      this.toastService.showError(
        'Veuillez corriger les erreurs du formulaire'
      );
    }
  }
}
