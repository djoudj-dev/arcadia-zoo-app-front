import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ServiceManagementComponent } from '../admin-dashboard/service-management/service-management.component';
import { AnimalFeedingManagementComponent } from './animal-feeding-management/animal-feeding-management.component';
import { UserOpinionManagementComponent } from './user-opinion-management/user-opinion-management.component';

type TabType = 'opinions' | 'services' | 'feeding';

@Component({
  selector: 'app-employe-dashboard',
  standalone: true,
  imports: [
    UserOpinionManagementComponent,
    ServiceManagementComponent,
    CommonModule,
    AnimalFeedingManagementComponent,
  ],
  templateUrl: './employe-dashboard.component.html',
})
export class EmployeDashboardComponent {
  activeTab: TabType = 'opinions';

  setActiveTab(tab: TabType) {
    this.activeTab = tab;
  }
}
