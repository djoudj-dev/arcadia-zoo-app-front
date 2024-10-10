import { Component } from '@angular/core';
import { Service } from '../../core/models/service.model';
import { SERVICES } from '../../reviews/mocks/services-mock.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './services.component.html',
})
export class ServicesComponent {
  services: Service[] = SERVICES;

  constructor(private route: ActivatedRoute, private router: Router) {}

  goBack() {
    this.router.navigate(['/']);
  }
}
