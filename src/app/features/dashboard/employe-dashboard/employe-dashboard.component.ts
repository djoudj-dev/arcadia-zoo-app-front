import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ServiceManagementComponent } from '../admin-dashboard/service-management/service-management.component';
import { UserOpinionManagementComponent } from './user-opinion-management/user-opinion-management.component';

@Component({
  selector: 'app-employe-dashboard',
  standalone: true,
  imports: [
    UserOpinionManagementComponent,
    ServiceManagementComponent,
    CommonModule,
  ],
  templateUrl: './employe-dashboard.component.html',
})
export class EmployeDashboardComponent {
  activeTab: 'opinions' | 'services' = 'opinions';

  setActiveTab(tab: 'opinions' | 'services') {
    this.activeTab = tab;
  }
}
