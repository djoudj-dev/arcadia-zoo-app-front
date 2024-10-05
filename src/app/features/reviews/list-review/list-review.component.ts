import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { Review } from './review.model';

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
            @for (star of stars; track star) {
            <svg
              class="w-6 h-6"
              [attr.fill]="star <= review.rating ? '#FFC107' : '#E0E0E0'"
              viewBox="0 0 20 20"
            >
              <path
                d="M10 0l2.6 6.8H20l-5 4.2 1.8 7.2-6.4-4.6-6.4 4.6 1.8-7.2-5-4.2h7.4z"
              />
            </svg>
            }
          </div>

          <!-- Message -->
          <p class="font-serif text-md">{{ review.message }}</p>
        </div>
        }
      </div>
    </section>
  `,
  standalone: true,
  imports: [DatePipe, StarRatingComponent],
})
export class ListReviewComponent {
  @Input() stars: number[] = [1, 2, 3, 4, 5];
  @Input() reviews: Review[] = [
    {
      name: 'John Doe',
      date: '2023-10-01',
      message: 'Super expérience, je recommande !',
      rating: 5,
    },
    {
      name: 'Jane Smith',
      date: '2023-09-15',
      message: 'Très bon accueil et de beaux animaux.',
      rating: 4,
    },
    // Ajoutez d'autres avis ici
  ];

  trackByFn(index: number) {
    return index; // ou tout autre identifiant unique de l'élément
  }
}
