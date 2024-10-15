import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Animal } from '../../core/models/animal.model';
import { Habitat } from '../../core/models/habitat.model';
import { VetNote } from '../../core/models/vetnote.model';
import { DatePipe } from '@angular/common';
import { NavComponent } from '../../shared/components/header/navbar/nav.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { HABITATS } from '../../core/mocks/habitats-mock.component';
import { AnimalService } from './service/animal.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private animalService: AnimalService // Injection du service
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id')); // Récupération de l'ID depuis l'URL
    console.log('Route param ID:', id);

    // Utilisation du service pour récupérer l'animal
    this.animalService.getAnimalById(id).subscribe((animal) => {
      this.animal = animal;

      // Si l'animal existe, récupérer l'habitat associé
      if (this.animal) {
        this.habitat = HABITATS.find(
          (habitat) => habitat.id === this.animal?.habitatId
        );
      }
    });
  }

  // Retour à la page d'accueil
  goBack() {
    this.router.navigate(['/']);
  }

  // Redirection vers la page de l'habitat
  goHabitat() {
    if (this.habitat) {
      this.router.navigate(['/habitat', this.habitat.id]);
    }
  }
}
