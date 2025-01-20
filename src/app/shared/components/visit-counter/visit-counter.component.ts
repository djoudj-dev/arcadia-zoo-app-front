import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { VisitTrackingService } from '../../../features/dashboard/admin-dashboard/stats-board/visit-stats/services/visit-tracking.service';

@Component({
  selector: 'app-visit-counter',
  standalone: true,
  imports: [CommonModule],
  providers: [VisitTrackingService],
  template: `
    <div
      class="absolute top-2 right-2 bg-tertiary/80 backdrop-blur-sm px-2 py-1 rounded-full z-10"
    >
      <span class="text-xs text-primary font-medium flex items-center">
        <i class="fas fa-eye mr-1"></i>
        {{ visits }}
      </span>
    </div>
  `,
})
export class VisitCounterComponent implements OnInit {
  @Input() categoryType!: 'animal' | 'habitat' | 'service';
  @Input() pageId!: number;
  visits: number = 0;

  constructor(private readonly visitTrackerService: VisitTrackingService) {}

  ngOnInit() {
    this.loadVisitCount();
  }

  private loadVisitCount(): void {
    this.visitTrackerService.getStatsByCategory(this.categoryType).subscribe({
      next: (stats) => {
        const pageStat = stats.find(
          (stat) => stat.category_name === String(this.pageId)
        );
        this.visits = pageStat?.visit_count ?? 0;
      },
      error: (err: Error) =>
        console.error('Erreur lors du chargement des visites:', err),
    });
  }
}
