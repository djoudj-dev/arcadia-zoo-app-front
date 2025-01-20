import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { CategoryType } from '../interfaces/visit-stats.interface';
import { VisitTrackingService } from '../services/visit-tracking.service';

@Directive({
  selector: '[appVisitTracker]',
  standalone: true,
})
export class VisitTrackerDirective implements OnInit, OnDestroy {
  @Input() categoryName!: string;
  @Input() categoryType!: CategoryType;
  @Input() pageId!: string | number;

  private startTime!: Date;

  constructor(private visitTrackingService: VisitTrackingService) {}

  ngOnInit() {
    this.startTime = new Date();
    this.trackVisitStart();
  }

  ngOnDestroy() {
    this.trackVisitEnd();
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

  private trackVisitStart() {
    this.visitTrackingService
      .trackVisit({
        categoryName: this.categoryName,
        categoryType: this.categoryType,
        pageId: this.getFormattedPageId(),
        startTime: this.startTime,
      })
      .subscribe();
  }

  private trackVisitEnd() {
    const endTime = new Date();
    const duration = (endTime.getTime() - this.startTime.getTime()) / 1000; // durée en secondes

    this.visitTrackingService
      .trackVisit({
        categoryName: this.categoryName,
        categoryType: this.categoryType,
        pageId: this.getFormattedPageId(),
        startTime: this.startTime,
        endTime: endTime,
        duration: duration,
      })
      .subscribe();
  }
}
