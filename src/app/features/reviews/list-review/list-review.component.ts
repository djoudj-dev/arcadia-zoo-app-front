import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Review } from './review.model';
import { REVIEW } from './list-mock.component';
import { RateComponent } from '../../../shared/components/rate/rate.component';

@Component({
  selector: 'app-list-review',
  templateUrl: './list-review.component.html',
  styleUrl: './list-review.component.css',
  standalone: true,
  imports: [DatePipe, RateComponent],
})
export class ListReviewComponent {
  @Input() stars: number[] = [1, 2, 3, 4, 5];

  @ViewChild('scrollContainer', { read: ElementRef })
  scrollContainer!: ElementRef;
  reviews: Review[] = [];

  ngOnInit() {
    this.reviews = REVIEW;
  }

  // Fonction pour faire défiler vers la gauche
  scrollLeft(): void {
    const container = this.scrollContainer.nativeElement;
    container.scrollBy({ left: -600, behavior: 'smooth' });
  }

  // Fonction pour faire défiler vers la droite
  scrollRight(): void {
    const container = this.scrollContainer.nativeElement;
    container.scrollBy({ left: 600, behavior: 'smooth' });
  }
}
