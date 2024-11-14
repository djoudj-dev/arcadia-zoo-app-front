import { Component } from '@angular/core';
import { AnimalsOverviewComponent } from './animals-overview/animals-overview.component';
import { HabitatsOverviewComponent } from './habitats-overview/habitats-overview.component';
import { ServicesOverviewComponent } from './services-overview/services-overview.component';
import { UserOpinionsComponent } from './user-opinions/user-opinions/user-opinions.component';
import { ZooIntroComponent } from './zoo-intro/zoo-intro.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    UserOpinionsComponent,
    ZooIntroComponent,
    HabitatsOverviewComponent,
    AnimalsOverviewComponent,
    ServicesOverviewComponent,
  ],
  templateUrl: './home.component.html',
  template: '<app-user-opinions />',
})
export class HomeComponent {}
