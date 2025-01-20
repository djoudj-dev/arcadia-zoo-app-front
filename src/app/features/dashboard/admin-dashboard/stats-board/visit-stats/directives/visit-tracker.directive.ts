import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { VisitTrackingService } from '../services/visit-tracking.service';

@Directive({
  selector: '[appVisitTracker]',
  standalone: true,
})
export class VisitTrackerDirective implements OnInit, OnDestroy {
  @Input() categoryName!: string;
  @Input() categoryType!: 'animal' | 'habitat' | 'service';

  private readonly pageId = crypto.randomUUID();

  constructor(private readonly trackingService: VisitTrackingService) {}

  ngOnInit() {
    this.trackingService.startTracking(
      this.categoryName,
      this.categoryType,
      this.pageId
    );
  }

  ngOnDestroy() {
    this.trackingService.stopTracking(this.pageId);
  }
}
