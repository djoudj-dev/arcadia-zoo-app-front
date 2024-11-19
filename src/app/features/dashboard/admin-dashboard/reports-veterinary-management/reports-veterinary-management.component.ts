import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { VeterinaryReports } from '../../veterinary-dashboard/veterinary-reports/model/veterinary-reports.model';
import { VeterinaryReportsService } from '../../veterinary-dashboard/veterinary-reports/service/veterinary-reports.service';

@Component({
  selector: 'app-reports-veterinary-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports-veterinary-management.component.html',
})
export class ReportsVeterinaryManagement implements OnInit {
  reports: VeterinaryReports[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private veterinaryReportsService: VeterinaryReportsService) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.isLoading = true;
    this.veterinaryReportsService
      .getAllReports()
      .pipe(
        map((reports) =>
          reports.map((report) => ({
            ...report,
            id_veterinary_reports: report._id,
            is_processed: report.is_treated || false,
          }))
        ),
        switchMap((reports) => {
          return forkJoin(
            reports.map((report) =>
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
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement des rapports';
          this.isLoading = false;
          console.error('Erreur:', error);
        },
      });
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

  getStatusButtonClass(isProcessed: boolean): string {
    return isProcessed
      ? 'bg-green-100 text-green-700 hover:bg-green-200'
      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
  }
}
