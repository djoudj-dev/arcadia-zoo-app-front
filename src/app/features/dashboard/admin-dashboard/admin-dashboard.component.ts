import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { CountResourceComponent } from './stats-board/counts-resource/count-resource.component';

interface NavigationItem {
  text: string;
  route: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonComponent,
    CountResourceComponent,
  ],
})
export class AdminDashboardComponent {
  navigationItems: NavigationItem[] = [
    { text: 'Gestion des comptes', route: 'admin/account-management' },
    { text: 'Gestion des services', route: 'admin/service-management' },
    { text: 'Gestion des habitats', route: 'admin/habitat-management' },
    { text: 'Gestion des animaux', route: 'admin/animal-management' },
    { text: 'Comptes rendus des vétérinaires', route: 'admin/vet-reports' },
    { text: 'Commentaire sur les habitats', route: 'admin/history-management' },
  ];

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
