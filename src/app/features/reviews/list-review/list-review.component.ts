import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Review } from './review.model';
import { REVIEW } from './list-mock.component';
import { RateComponent } from '../../../shared/components/rate/rate.component';
import { FormsModule } from '@angular/forms'; // Ajout pour NgModel

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
          <app-rate [(ngModel)]="rating" name="rating"></app-rate>

          <!-- Message -->
          <p class="font-serif text-md">{{ review.message }}</p>
        </div>
        }
      </div>
    </section>
  `,
  standalone: true,
  imports: [RateComponent, DatePipe, FormsModule], // Ajout de FormsModule
})
export class ListReviewComponent implements OnInit {
  rating = 5;

  reviews: Review[] = [];

  ngOnInit() {
    this.reviews = REVIEW;
  }
}
