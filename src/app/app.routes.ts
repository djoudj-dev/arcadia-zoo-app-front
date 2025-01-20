import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guard/auth.guard';
import { AdminDashboardComponent } from './features/dashboard/admin-dashboard/admin-dashboard.component';
import { AnimalManagementComponent } from './features/dashboard/admin-dashboard/animal-management/animal-management.component';
import { OpeningHoursManagementComponent } from './features/dashboard/admin-dashboard/opening-hours-management/opening-hours-management.component';
import { VeterinaryDashboardComponent } from './features/dashboard/veterinary-dashboard/veterinary-dashboard.component';
import { HomeComponent } from './features/home/home.component';

// Routes publiques
const publicRoutes: Routes = [
  { path: '', component: HomeComponent, title: 'Accueil - Zoo Arcadia' },
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
];

// Routes administrateur
const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminDashboardComponent,
    children: [
      {
        path: 'animal-management',
        component: AnimalManagementComponent,
      },
      {
        path: 'account-management',
        loadComponent: () =>
          import(
            './features/dashboard/admin-dashboard/account-management/account-management.component'
          ).then((m) => m.AccountManagementComponent),
        title: 'Gestion des comptes',
      },
      {
        path: 'service-management',
        loadComponent: () =>
          import(
            './features/dashboard/admin-dashboard/service-management/service-management.component'
          ).then((m) => m.ServiceManagementComponent),
        title: 'Modification des services',
      },
      {
        path: 'habitat-management',
        loadComponent: () =>
          import(
            './features/dashboard/admin-dashboard/habitat-management/habitat-management.component'
          ).then((m) => m.HabitatManagementComponent),
        title: 'Gestion des habitats',
      },
      {
        path: 'veterinary-reports',
        loadComponent: () =>
          import(
            './features/dashboard/admin-dashboard/reports-veterinary-management/reports-veterinary-management.component'
          ).then((m) => m.ReportsVeterinaryManagement),
        title: 'Comptes rendus des vétérinaires',
      },
      {
        path: 'history-management',
        loadComponent: () =>
          import(
            './features/dashboard/admin-dashboard/history-management/history-management.component'
          ).then((m) => m.HistoryManagementComponent),
        title: 'Consultation des historiques',
      },
      {
        path: 'opening-hours-management',
        component: OpeningHoursManagementComponent,
        title: "Gestion des horaires d'ouverture",
      },
    ],
  },
];

// Routes vétérinaire
const veterinaryRoutes: Routes = [
  {
    path: 'veterinaire',
    component: VeterinaryDashboardComponent,
    title: 'Dashboard Vétérinaire',
    canActivate: [authGuard],
    data: { roles: ['Veterinaire'] },
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        component: VeterinaryDashboardComponent,
      },
      {
        path: 'history',
        component: VeterinaryDashboardComponent,
      },
    ],
  },
];

// Routes employé
const employeeRoutes: Routes = [
  {
    path: 'employe',
    loadComponent: () =>
      import(
        './features/dashboard/employe-dashboard/employe-dashboard.component'
      ).then((m) => m.EmployeDashboardComponent),
    title: 'Employé',
    canActivate: [authGuard],
    data: { roles: ['Employe'] },
    children: [
      {
        path: '',
        redirectTo: 'pending',
        pathMatch: 'full',
      },
      {
        path: 'pending',
        loadComponent: () =>
          import(
            './features/dashboard/employe-dashboard/user-opinion-management/user-opinion-management.component'
          ).then((m) => m.UserOpinionManagementComponent),
      },
      {
        path: 'validated',
        loadComponent: () =>
          import(
            './features/dashboard/employe-dashboard/user-opinion-management/user-opinion-management.component'
          ).then((m) => m.UserOpinionManagementComponent),
      },
      {
        path: 'rejected',
        loadComponent: () =>
          import(
            './features/dashboard/employe-dashboard/user-opinion-management/user-opinion-management.component'
          ).then((m) => m.UserOpinionManagementComponent),
      },
    ],
  },
];

// Routes communes aux utilisateurs authentifiés
const authenticatedRoutes: Routes = [
  {
    path: 'update-password',
    loadComponent: () =>
      import(
        './features/dashboard/admin-dashboard/account-management/update-password.component'
      ).then((m) => m.UpdatePasswordComponent),
    title: 'Modification du mot de passe',
    canActivate: [authGuard],
    data: { roles: ['Admin', 'Veterinaire', 'Employe'] },
  },
];

export const routes: Routes = [
  ...publicRoutes,
  ...adminRoutes,
  ...veterinaryRoutes,
  ...employeeRoutes,
  ...authenticatedRoutes,
  { path: '**', redirectTo: '' },
];
