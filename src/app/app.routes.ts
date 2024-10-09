import { Routes } from '@angular/router';
import { AnimalComponent } from './features/animal/animal.component';
import { HomeComponent } from './features/home/home.component';
import { HabitatComponent } from './features/habitat/habitat.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'animal/:id', component: AnimalComponent, title: 'Animal' },
  { path: 'habitat/:id', component: HabitatComponent, title: 'Habitat' },
  { path: '**', redirectTo: '' },
];
