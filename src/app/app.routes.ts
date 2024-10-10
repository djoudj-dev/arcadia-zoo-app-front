import { Routes } from '@angular/router';
import { AnimalComponent } from './features/animal/animal.component';
import { HomeComponent } from './features/home/home.component';
import { HabitatComponent } from './features/habitats/habitat/habitat.component';
import { HabitatsComponent } from './features/habitats/habitats.component';
import { ServicesComponent } from './features/services/services.component';
import { ServiceComponent } from './features/services/service/service.component';
import { ContactComponent } from './features/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'animal/:id', component: AnimalComponent, title: 'Animal' },
  { path: 'habitat/:id', component: HabitatComponent, title: 'Habitat' },
  { path: 'habitats', component: HabitatsComponent, title: 'Habitat' },
  { path: 'services', component: ServicesComponent, title: 'Services' },
  { path: 'service/:id', component: ServiceComponent, title: 'Service' },
  { path: 'contact', component: ContactComponent, title: 'Contact' },
  { path: '**', redirectTo: '' },
];
