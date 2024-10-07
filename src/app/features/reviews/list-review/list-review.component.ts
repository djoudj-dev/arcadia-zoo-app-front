import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Review } from './review.model';
import { REVIEW } from './list-mock.component';
import { RateComponent } from '../../../shared/components/rate/rate.component';

@Component({
  selector: 'app-list-review',
  template: `
    <section class="bg-primary shadow pt-4 pb-4">
      <!-- Titre de la section -->
      <div class="text-center mb-4">
        <h1 class="text-xl sm:text-2xl md:text-3xl font-bold font-serif">
          Ils ont donné leur avis
        </h1>
      </div>

      <div class="px-4 max-w-4xl mx-auto">
        @for (review of reviews; track review) {
        <div class="bg-[#A3B583] rounded-lg p-6 mb-6 shadow-md">
          <!-- Flex pour organiser nom et date -->
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-serif text-lg font-bold">
              {{ review.name }}
            </h3>

            <!-- Date à droite -->
            <div class="text-right font-serif text-sm">
              <p>Le {{ review.date | date : 'dd/MM/yyyy' }}</p>
            </div>
          </div>

          <!-- Affichage des étoiles -->
          <div class="flex space-x-1 mb-4">
            <app-rate [rating]="review.rating" [stars]="stars"></app-rate>
          </div>

          <!-- Message -->
          <p class="font-serif text-md">{{ review.message }}</p>
        </div>
        }
      </div>
    </section>
  `,
  standalone: true,
  imports: [DatePipe, RateComponent],
})
export class ListReviewComponent {
  @Input() stars: number[] = [1, 2, 3, 4, 5];

  reviews: Review[] = [];

  ngOnInit() {
    this.reviews = REVIEW;
  }
}
