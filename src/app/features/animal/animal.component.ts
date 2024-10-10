import { Component, OnInit } from '@angular/core';
import { Animal } from '../../core/models/animal.model';
import { ANIMALS } from '../../reviews/mocks/animals-mock.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavComponent } from '../../shared/components/header/navbar/nav.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Habitat } from '../../core/models/habitat.model';
import { HABITATS } from '../../reviews/mocks/habitats-mock.component';
import { VetNote } from '../../core/models/vetnote.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-animal',
  standalone: true,
  imports: [
    RouterLink,
    NavComponent,
    FooterComponent,
    ButtonComponent,
    DatePipe,
  ],
  templateUrl: './animal.component.html',
  styles: [
    `
      span {
        font-weight: bold;
        color: #0e1805;
      }
    `,
  ],
})
export class AnimalComponent implements OnInit {
  animal: Animal | undefined;
  habitat: Habitat | undefined;
  vetNote: VetNote | undefined;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Route param ID:', id);

    // Récupérer l'animal
    this.animal = ANIMALS.find((animal) => animal.id === Number(id));

    // Récupérer l'habitat associé à l'animal
    if (this.animal) {
      this.habitat = HABITATS.find(
        (habitat) => habitat.id === this.animal?.habitatId
      );
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  goHabitat() {
    if (this.habitat) {
      this.router.navigate(['/habitat', this.habitat.id]); // Redirection vers l'habitat spécifique
    }
  }
}
