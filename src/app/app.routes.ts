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
    title: 'Habitats',
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
      import('./features/admin-dashboard/admin-dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    title: 'Admin',
    canActivate: [authGuard],
    data: { roles: ['Admin'] }, // Ajout du rôle requis
    children: [
      {
        path: 'account-management',
        loadComponent: () =>
          import(
            './features/admin-dashboard/account-management/account-management.component'
          ).then((m) => m.AccountManagementComponent),
        title: 'Gestion des comptes',
      },
      {
        path: 'service-management',
        loadComponent: () =>
          import(
            './features/admin-dashboard/service-management/service-management.component'
          ).then((m) => m.ServiceManagementComponent),
        title: 'Modification des services',
      },
      {
        path: 'habitat-management',
        loadComponent: () =>
          import(
            './features/admin-dashboard/habitat-management/habitat-management.component'
          ).then((m) => m.HabitatManagementComponent),
        title: 'Gestion des habitats',
      },
      {
        path: 'animal-management',
        loadComponent: () =>
          import(
            './features/admin-dashboard/animal-management/animal-management.component'
          ).then((m) => m.AnimalManagementComponent),
        title: 'Gestion des animaux',
      },
      {
        path: 'vet-reports',
        loadComponent: () =>
          import(
            './features/admin-dashboard/reports-veterinaire-dashboard/reports-veterinaire-dashboard.component'
          ).then((m) => m.ReportsVeterinaireDashboardComponent),
        title: 'Comptes rendus des vétérinaires',
      },
      {
        path: 'habitats-dashboard',
        loadComponent: () =>
          import(
            './features/admin-dashboard/habitats-dashboard/habitats-dashboard.component'
          ).then((m) => m.HabitatsDashboardComponent),
        title: 'Consultation des habitats',
      },
    ],
  },
  {
    path: 'veterinaire',
    loadComponent: () =>
      import('./features/veterinaire-dashboard/vet/vet.component').then(
        (m) => m.VetComponent
      ),
    title: 'Vétérinaire',
    canActivate: [authGuard],
    data: { roles: ['Vétérinaire'] }, // Ajout du rôle requis
  },
  { path: '**', redirectTo: '' },
];
