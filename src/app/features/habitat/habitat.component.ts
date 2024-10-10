import { Component } from '@angular/core';
import { Habitat } from '../../core/models/habitat.model';
import { HABITATS } from '../../reviews/mocks/habitats-mock.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-habitat',
  standalone: true,
  imports: [],
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
}
