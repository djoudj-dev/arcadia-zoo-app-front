import { Component } from '@angular/core';
import { Habitat } from '../../core/models/habitat.model';
import { HABITATS } from '../../reviews/mocks/habitats-mock.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-habitats',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './habitats.component.html',
})
export class HabitatsComponent {
  habitats: Habitat[] = HABITATS;

  constructor(private route: ActivatedRoute, private router: Router) {}

  goBack() {
    this.router.navigate(['/']);
  }
}
