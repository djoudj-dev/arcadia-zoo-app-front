import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { VeterinaryReports } from '../veterinary-reports/model/veterinary-reports.model';
import { VeterinaryReportsService } from '../veterinary-reports/service/veterinary-reports.service';
import { VeterinaryReportsComponent } from '../veterinary-reports/veterinary-reports.component';

@Component({
  selector: 'app-veterinary-reports-list',
  standalone: true,
  imports: [CommonModule, VeterinaryReportsComponent],
  template: `
    <div class="space-y-4">
      @if (!showReportForm) {
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-serif text-tertiary">Rapports vétérinaires</h2>
      </div>

      @for (report of reports; track $index) {
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex justify-between items-start">
          <div class="flex items-start gap-4">
            <img
              [src]="report.animal_photo"
              [alt]="report.animal_name"
              class="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 class="text-lg font-medium text-tertiary">
                {{ report.animal_name }}
              </h3>
              <p class="text-sm text-quinary/60">
                {{ report.visit_date | date : 'dd/MM/yyyy' }}
              </p>
              <div class="mt-2 space-y-1">
                <p class="text-sm">
                  <span class="font-medium">Alimentation recommandée:</span>
                  {{ report.recommended_food_quantity
                  }}{{ report.food_unit }} de {{ report.recommended_food_type }}
                </p>
                @if (report.additional_details) {
                <p class="text-sm">
                  <span class="font-medium">Détails supplémentaires:</span>
                  {{ report.additional_details }}
                </p>
                }
                <p class="text-sm mt-2 text-quinary/80">
                  <span class="font-medium">Vétérinaire:</span>
                  {{ report.user_name }}
                </p>
              </div>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <span [class]="getStateClass(report.animal_state)" class="ml-2">
              <i class="fas fa-{{ getStateIcon(report.animal_state) }}"></i>
              {{ report.animal_state }}
            </span>
            <span
              [class]="getStatusButtonClass(report.is_processed ?? false)"
              class="px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ report.is_processed ? 'Traité' : 'Non traité' }}
            </span>
          </div>
        </div>
      </div>
      } } @if (showReportForm) {
      <app-veterinary-reports (close)="closeReportForm()" />
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
})
export class VeterinaryReportsListComponent implements OnInit {
  @Input() animalId!: number;
  @Input() showReportForm = false;
  @Input() reportStatus?: boolean;

  reports: VeterinaryReports[] = [];

  constructor(private veterinaryReportsService: VeterinaryReportsService) {}

  ngOnInit() {
    this.loadReports();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['reportStatus']) {
      this.loadReports();
    }
  }

  loadReports() {
    this.veterinaryReportsService
      .getAllReports()
      .pipe(
        map((reports) =>
          reports.map((report) => ({
            ...report,
            is_processed: report.is_treated || false,
          }))
        ),
        switchMap((reports) => {
          const filteredReports = reports.filter(
            (report) => report.id_animal === this.animalId
          );
          return forkJoin(
            filteredReports.map((report) =>
              this.veterinaryReportsService
                .fetchAnimalDetails(report.id_animal)
                .pipe(
                  map((animal) => ({
                    ...report,
                    animal_photo: animal.images || '',
                    animal_name: animal.name,
                  }))
                )
            )
          );
        })
      )
      .subscribe({
        next: (reportsWithImages) => {
          this.reports = reportsWithImages;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des rapports:', error);
        },
      });
  }

  openNewReportForm() {
    this.showReportForm = true;
  }

  closeReportForm() {
    this.showReportForm = false;
    this.loadReports(); // Recharger la liste après la création d'un rapport
  }

  getStateClass(state: string): string {
    const baseClasses =
      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap min-w-[140px] justify-center';

    switch (state.toLowerCase()) {
      case 'bonne santé':
        return `${baseClasses} bg-green-100 text-green-700`;
      case 'malade':
        return `${baseClasses} bg-red-100 text-red-700`;
      case 'en traitement':
        return `${baseClasses} bg-yellow-100 text-yellow-700`;
      case 'en observation':
        return `${baseClasses} bg-blue-100 text-blue-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  }

  getStateIcon(state: string): string {
    switch (state.toLowerCase()) {
      case 'bonne santé':
        return 'check-circle';
      case 'malade':
        return 'exclamation-circle';
      case 'en traitement':
        return 'clock';
      case 'en observation':
        return 'eye';
      default:
        return 'information-circle';
    }
  }

  getStatusButtonClass(isProcessed: boolean): string {
    return isProcessed
      ? 'bg-green-100 text-green-700 hover:bg-green-200'
      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
  }

  toggleReportStatus(report: VeterinaryReports) {
    const reportId = report._id || report.id_veterinary_reports;

    if (!reportId) {
      console.error('ID du rapport non défini:', report);
      return;
    }

    const newStatus = !report.is_processed;

    this.veterinaryReportsService
      .updateReportStatus(reportId, newStatus)
      .subscribe({
        next: () => {
          report.is_processed = newStatus;
          report.is_treated = newStatus;
          console.log('Statut du rapport mis à jour avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du statut:', error);
          report.is_processed = !newStatus;
          report.is_treated = !newStatus;
        },
      });
  }
}
