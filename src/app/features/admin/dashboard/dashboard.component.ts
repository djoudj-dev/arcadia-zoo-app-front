import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { User } from '../../../core/models/user.model';
import { AdminService } from '../service/admin.service';
import { Role } from '../../../core/models/role.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  users: User[] = [];
  roles: Role[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.adminService.getAllUsers().subscribe((users: User[]) => {
      console.log('Utilisateurs récupérés:', users); // Vérifiez si les utilisateurs sont bien chargés
      this.users = users;
    });
  }

  loadRoles() {
    this.adminService.getRoles().subscribe((roles: Role[]) => {
      console.log('Rôles récupérés:', roles); // Vérifiez si les rôles sont bien chargés
      this.roles = roles;
    });
  }
}
