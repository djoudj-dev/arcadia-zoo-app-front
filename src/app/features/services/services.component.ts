import { Component } from '@angular/core';
import { Service } from '../../core/models/service.model';
import { SERVICES } from '../../reviews/mocks/services-mock.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [],
  templateUrl: './services.component.html',
})
export class ServicesComponent {
  services: Service[] = SERVICES;
}
