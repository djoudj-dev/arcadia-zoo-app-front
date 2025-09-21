import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { CategoryType } from '../interfaces/visit-stats.interface';
import { VisitTrackingService } from '../services/visit-tracking.service';

@Directive({
  selector: '[appVisitTracker]',
})
export class VisitTrackerDirective implements OnInit, OnDestroy {
  @Input() categoryName!: string;
  @Input() categoryType!: CategoryType;
  @Input() pageId!: string | number;

  constructor(private readonly visitTrackingService: VisitTrackingService) {}

  ngOnInit() {
    this.visitTrackingService.startTracking(
      this.categoryName,
      this.categoryType,
      this.getFormattedPageId()
    );
  }

  ngOnDestroy() {
    this.visitTrackingService.stopTracking(this.getFormattedPageId());
  }

  private getFormattedPageId(): string {
    if (typeof this.pageId === 'string') return this.pageId;

    // Convertir l'ID numérique en string avec le bon préfixe selon le type
    switch (this.categoryType) {
      case 'animal':
        return `animal_${this.pageId}`;
      case 'habitat':
        return `habitat_${this.pageId}`;
      case 'service':
        return `service_${this.pageId}`;
      default:
        return String(this.pageId);
    }
  }
}
