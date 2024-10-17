import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './core/login/login.component';
import { authGuard } from './core/auth/guard/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'animal/:id',
    loadComponent: () =>
      import('./features/animal/animal.component').then(
        (m) => m.AnimalComponent
      ),
    title: 'Animal',
  },
  {
    path: 'habitat/:id',
    loadComponent: () =>
      import('./features/habitats/habitat/habitat.component').then(
        (m) => m.HabitatComponent
      ),
    title: 'Habitat',
  },
  {
    path: 'habitats',
    loadComponent: () =>
      import('./features/habitats/habitats.component').then(
        (m) => m.HabitatsComponent
      ),
    title: 'Habitat',
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./features/zoo-services/services.component').then(
        (m) => m.ServicesComponent
      ),
    title: 'Services',
  },
  {
    path: 'service/:id',
    loadComponent: () =>
      import('./features/zoo-services/zoo-service/service.component').then(
        (m) => m.ServiceComponent
      ),
    title: 'Service',
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/contact/contact.component').then(
        (m) => m.ContactComponent
      ),
    title: 'Contact',
  },
  { path: 'login', component: LoginComponent, title: 'Connexion' },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    title: 'Admin',
  },
  {
    path: 'vétérinaire',
    loadComponent: () =>
      import('./features/vet/vet.component').then((m) => m.VetComponent),
    title: 'Vétérinaire',
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
