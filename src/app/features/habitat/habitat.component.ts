import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Habitat } from '../../core/models/habitat.model';
import { HABITATS } from '../../reviews/mocks/habitats-mock.component';

@Component({
  selector: 'app-habitat',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './habitat.component.html',
  styles: [
    `
      span {
        font-weight: bold;
        color: #0e1805;
      }
    `,
  ],
})
export class HabitatComponent {
  habitat: Habitat | undefined;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Route param ID:', id);

    this.habitat = HABITATS.find((habitat) => habitat.id === Number(id));
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
