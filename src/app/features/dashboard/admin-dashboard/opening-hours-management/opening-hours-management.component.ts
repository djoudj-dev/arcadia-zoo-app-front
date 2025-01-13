import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { firstValueFrom, from } from 'rxjs';
import { ToastService } from '../../../../shared/components/toast/services/toast.service';
import {
  OpeningHours,
  OpeningHoursFormData,
  ParkStatus,
} from './models/opening-hours.model';
import { OpeningHoursService } from './services/opening-hours.service';

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
  hoursForm: FormGroup;

  /** ID des horaires */
  openingHoursId = signal<string | null>(null);

  constructor(
    private readonly fb: FormBuilder,
    private readonly openingHoursService: OpeningHoursService,
    private readonly toastService: ToastService
  ) {
    this.hoursForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  /**
   * Initialise le formulaire avec les valeurs par défaut
   */
  private createForm(): FormGroup {
    return this.fb.group({
      weekdayHours: ['', Validators.required],
      weekendHours: ['', Validators.required],
      isWeekdayOpen: [true],
      isWeekendOpen: [true],
      parkStatus: [true],
      statusMessage: [''],
    });
  }

  /**
   * Charge les données initiales des horaires
   */
  private loadInitialData(): void {
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
          } else {
            console.warn("L'ID des horaires n'a pas été retourné par l'API.");
          }

          this.patchForm(hours);
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des horaires:', error);
        this.toastService.showError('Erreur lors du chargement des horaires');
      },
    });
  }

  /**
   * Met à jour le formulaire avec les données actuelles
   * @param hours Les horaires actuels
   */
  private patchForm(hours: OpeningHours): void {
    const weekdaySchedule = hours.openingHours.find((h) =>
      h.days.includes('Lundi')
    );
    const weekendSchedule = hours.openingHours.find((h) =>
      h.days.includes('Samedi')
    );

    this.hoursForm.patchValue({
      weekdayHours: weekdaySchedule?.hours ?? '',
      weekendHours: weekendSchedule?.hours ?? '',
      isWeekdayOpen: weekdaySchedule?.isOpen ?? true,
      isWeekendOpen: weekendSchedule?.isOpen ?? true,
      parkStatus: hours.parkStatus,
      statusMessage: hours.statusMessage || '',
    });
  }

  /**
   * Met à jour les horaires
   */
  async updateHours(): Promise<void> {
    try {
      // Tenter de récupérer l'ID depuis le service
      const id = await this.openingHoursService.getOpeningHoursId();

      if (!id) {
        console.error("L'ID des horaires est manquant.");
        this.toastService.showError('ID des horaires non défini');
        return;
      }

      if (this.hoursForm.invalid) {
        console.error('Formulaire invalide:', this.hoursForm.errors);
        this.toastService.showError(
          'Veuillez corriger les erreurs du formulaire'
        );
        return;
      }

      const formData = this.prepareFormData();

      const response = await firstValueFrom(
        this.openingHoursService.updateOpeningHours(id, formData)
      );

      if (response) {
        this.openingHours.set([response]);
        this.patchForm(response);
        this.toastService.showSuccess('Horaires mis à jour avec succès');
      }
    } catch (error) {
      console.error('Erreur complète lors de la mise à jour:', error);
      this.toastService.showError('Erreur lors de la mise à jour des horaires');
    }
  }

  /**
   * Prépare les données à partir du formulaire
   * @returns Les données formatées pour l'API
   */
  private prepareFormData(): OpeningHoursFormData {
    return {
      weekdayHours: this.hoursForm.get('weekdayHours')?.value || '',
      weekendHours: this.hoursForm.get('weekendHours')?.value || '',
      isWeekdayOpen: this.hoursForm.get('isWeekdayOpen')?.value ?? true,
      isWeekendOpen: this.hoursForm.get('isWeekendOpen')?.value ?? true,
      parkStatus: this.hoursForm.get('parkStatus')?.value ?? true,
      statusMessage: this.hoursForm.get('statusMessage')?.value || '',
    };
  }

  /**
   * Crée de nouveaux horaires
   */
  async createNewHours(): Promise<void> {
    const formData = this.prepareFormData(); // Prépare les données
    console.log('Données préparées pour création:', formData);

    try {
      const response = await firstValueFrom(
        from(this.openingHoursService.createOpeningHours(formData))
      );

      if (response?._id) {
        console.log('Réponse de création:', response);
        this.openingHoursId.set(response._id); // Définit le nouvel ID
        this.openingHours.set([response]);
        this.patchForm(response); // Met à jour le formulaire avec la nouvelle réponse
        this.toastService.showSuccess('Horaires créés avec succès');
      } else {
        throw new Error("La création n'a pas retourné d'ID valide.");
      }
    } catch (error) {
      console.error('Erreur lors de la création des horaires:', error);
      this.toastService.showError('Erreur lors de la création des horaires');
    }
  }

  /**
   * Sauvegarde les modifications ou crée de nouveaux horaires
   */
  async saveChanges(): Promise<void> {
    try {
      if (!this.hoursForm.valid) {
        this.toastService.showError(
          'Veuillez remplir correctement tous les champs requis'
        );
        return;
      }

      const openingHoursId = this.openingHoursId();

      if (!openingHoursId) {
        console.log('Aucun ID trouvé, création de nouveaux horaires.');
        await this.createNewHours(); // Appelle createNewHours si aucun ID
      } else {
        await this.updateHours(); // Appelle updateHours si un ID est défini
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      this.toastService.showError('Erreur lors de la sauvegarde des horaires');
    }
  }

  async ensureOpeningHoursExist(): Promise<string> {
    try {
      const id = await this.openingHoursService.getOpeningHoursId();
      return id;
    } catch {
      // Si aucun horaire n'existe, en créer un nouveau
      const defaultData: OpeningHoursFormData = {
        weekdayHours: '9h00 - 18h00',
        weekendHours: '10h00 - 19h00',
        isWeekdayOpen: true,
        isWeekendOpen: true,
        parkStatus: true,
        statusMessage: '',
      };

      const newHours = await firstValueFrom(
        from(this.openingHoursService.createOpeningHours(defaultData))
      );
      if (!newHours._id) {
        throw new Error("L'ID des nouveaux horaires est manquant.");
      }
      return newHours._id;
    }
  }

  async getOpeningHoursId(): Promise<string> {
    try {
      const currentHours = this.openingHours();
      if (currentHours && currentHours.length > 0 && currentHours[0]._id) {
        return currentHours[0]._id;
      } else {
        // Si aucun horaire n'existe, en créer un nouveau
        const defaultData: OpeningHoursFormData = {
          weekdayHours: '9h00 - 18h00',
          weekendHours: '10h00 - 19h00',
          isWeekdayOpen: true,
          isWeekendOpen: true,
          parkStatus: true,
          statusMessage: '',
        };

        const newHours = await firstValueFrom(
          from(this.openingHoursService.createOpeningHours(defaultData))
        );
        return newHours._id as string;
      }
    } catch (error) {
      console.error(
        'Erreur lors de la récupération ou de la création des horaires:',
        error
      );
      throw new Error('Aucun ID trouvé pour les horaires');
    }
  }
}
