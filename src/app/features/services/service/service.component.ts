import { Component } from '@angular/core';
import { Service } from '../../../core/models/service.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SERVICES } from '../../../reviews/mocks/services-mock.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './service.component.html',
  styles: [
    `
      span {
        font-weight: bold;
      }
    `,
  ],
})
export class ServiceComponent {
  service: Service | undefined;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Route param ID:', id);

    this.service = SERVICES.find((service) => service.id === Number(id));
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
