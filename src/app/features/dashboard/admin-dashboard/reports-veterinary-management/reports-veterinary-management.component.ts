import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { environment } from 'environments/environment';
import { EMPTY, from, mergeMap, toArray } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { VeterinaryReports } from '../../veterinary-dashboard/veterinary-reports/model/veterinary-reports.model';
import { VeterinaryReportsService } from '../../veterinary-dashboard/veterinary-reports/service/veterinary-reports.service';

/**
 * Composant de gestion des rapports vétérinaires
 * Permet de consulter et gérer les rapports des vétérinaires
 */
@Component({
  selector: 'app-reports-veterinary-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports-veterinary-management.component.html',
})
export class ReportsVeterinaryManagement implements OnInit {
  /** État des données */
  reports: VeterinaryReports[] = [];
  isLoading = true;
  error: string | null = null;
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  latestVeterinaryReport = signal<VeterinaryReports | undefined>(undefined);

  constructor(
    private readonly veterinaryReportsService: VeterinaryReportsService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadReports();
  }

  /**
   * Charge les rapports vétérinaires avec les détails des animaux
   */
  loadReports(page: number = 1) {
    this.isLoading = true;
    this.veterinaryReportsService
      .getAllReports(page, this.pageSize)
      .pipe(
        switchMap((response) => {
          this.totalItems = response.total;
          const processedReports = response.data.map((report) => ({
            ...report,
            id_veterinary_reports: report._id,
            is_processed: report.is_treated || false,
          }));

          const uniqueAnimalIds = [
            ...new Set(processedReports.map((r) => r.id_animal)),
          ];

          return from(uniqueAnimalIds).pipe(
            mergeMap(
              (animalId) =>
                this.veterinaryReportsService.fetchAnimalDetails(animalId),
              3 // Limite de concurrence à 3 appels simultanés
            ),
            map((animal) => {
              return processedReports
                .filter((report) => report.id_animal === animal.id_animal)
                .map((report) => ({
                  ...report,
                  animal_photo: this.formatImageUrl(animal.images),
                  animal_name: animal.name,
                }));
            }),
            toArray(),
            map((arrays) => arrays.flat())
          );
        })
      )
      .subscribe({
        next: (reportsWithImages) => {
          this.reports = reportsWithImages;
          this.isLoading = false;
          this.toastService.showSuccess('Rapports chargés avec succès');
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement des rapports';
          this.isLoading = false;
          console.error('Erreur:', error);
          this.toastService.showError('Erreur lors du chargement des rapports');
        },
      });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadReports(page);
  }

  private formatImageUrl(imagePath: string | null): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) {
      return imagePath.replace(
        `${environment.apiUrl}/api/${environment.apiUrl}/api/`,
        `${environment.apiUrl}/api/`
      );
    }
    return `${environment.apiUrl}/api/uploads/animals/${imagePath}`;
  }

  /**
   * Détermine les classes CSS pour l'état de santé
   * @param state État de santé de l'animal
   * @returns Classes CSS correspondantes
   */
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

  /**
   * Détermine l'icône à afficher selon l'état de santé
   * @param state État de santé de l'animal
   * @returns Nom de l'icône FontAwesome
   */
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

  /**
   * Change le statut de traitement d'un rapport
   * @param report Rapport à modifier
   */
  toggleReportStatus(report: VeterinaryReports) {
    const reportId = report._id ?? report.id_veterinary_reports;

    if (!reportId) {
      this.toastService.showError('ID du rapport non défini');
      return;
    }

    const newStatus = !report.is_processed;

    this.veterinaryReportsService
      .updateReportStatus(reportId, newStatus)
      .subscribe({
        next: () => {
          report.is_processed = newStatus;
          report.is_treated = newStatus;
          this.toastService.showSuccess(
            'Statut du rapport mis à jour avec succès'
          );
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du statut:', error);
          report.is_processed = !newStatus;
          report.is_treated = !newStatus;
          this.toastService.showError(
            'Erreur lors de la mise à jour du statut'
          );
        },
      });
  }

  getProcessedButtonClass(): string {
    return 'bg-green-100 text-green-700 hover:bg-green-200';
  }

  getPendingButtonClass(): string {
    return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
  }

  private loadVeterinaryReports(animalId: number) {
    if (!animalId) {
      console.error('ID animal manquant');
      return;
    }

    this.veterinaryReportsService
      .getAllReports()
      .pipe(
        map((response) => {
          // Filtrer les rapports pour cet animal
          const animalReports = response.data.filter(
            (report) => report.id_animal === animalId
          );

          // Trier par date et prendre le plus récent
          const sortedReports = [...animalReports].sort(
            (a, b) =>
              new Date(b.visit_date).getTime() -
              new Date(a.visit_date).getTime()
          );

          return sortedReports[0];
        }),
        catchError((error) => {
          console.error('Erreur lors du chargement des rapports:', error);
          this.toastService.showError(
            'Impossible de charger les rapports vétérinaires'
          );
          return EMPTY;
        })
      )
      .subscribe({
        next: (latestReport) => {
          this.latestVeterinaryReport.set(latestReport || undefined);
        },
      });
  }
}
