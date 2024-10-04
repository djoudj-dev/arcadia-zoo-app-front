import { Component } from '@angular/core';
import { ZooIntroComponent } from './zoo-intro/zoo-intro.component';
import { HabitatsOverviewComponent } from './habitats-overview/habitats-overview.component';
import { ServicesOverviewComponent } from './services-overview/services-overview.component';
import { FormReviewComponent } from '../reviews/form-review/form-review.component';
import { ListReviewComponent } from '../reviews/list-review/list-review.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ZooIntroComponent,
    HabitatsOverviewComponent,
    ServicesOverviewComponent,
    FormReviewComponent,
    ListReviewComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
