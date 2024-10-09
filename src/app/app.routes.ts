import { Routes } from '@angular/router';
import { AnimalComponent } from './features/animal/animal.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'animal/:id', component: AnimalComponent, title: 'Animal' },
  { path: '**', redirectTo: '' },
];
