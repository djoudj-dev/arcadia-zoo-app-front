import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guard/auth.guard';
import { OpeningHoursManagementComponent } from './features/dashboard/admin-dashboard/opening-hours-management/opening-hours-management.component';
import { VeterinaryDashboardComponent } from './features/dashboard/veterinary-dashboard/veterinary-dashboard.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Accueil' },

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
      import(
        './features/dashboard/admin-dashboard/admin-dashboard.component'
      ).then((m) => m.AdminDashboardComponent),
    title: 'Admin',
    canActivate: [authGuard],
    data: { roles: ['Admin'] },
    children: [
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
        path: 'animal-management',
        loadComponent: () =>
          import(
            './features/dashboard/admin-dashboard/animal-management/animal-management.component'
          ).then((m) => m.AnimalManagementComponent),
        title: 'Gestion des animaux',
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

  {
    path: 'veterinaire',
    component: VeterinaryDashboardComponent,
    title: 'Dashboard Vétérinaire',
    canActivate: [authGuard],
    data: { roles: ['Veterinaire'] },
    children: [
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

  // Routes pour les employés
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
  {
    path: 'update-password',
    loadComponent: () =>
      import(
        './features/dashboard/admin-dashboard/account-management/update-password.component'
      ).then((m) => m.UpdatePasswordComponent),
    title: 'Modification du mot de passe',
    canActivate: [authGuard],
    data: { roles: ['Admin', 'Veterinaire', 'Employe'] }, // Accessible à tous les utilisateurs connectés
  },

  { path: '**', redirectTo: '' }, // Redirection pour les chemins non définis
];
