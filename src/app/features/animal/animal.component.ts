import { Component, OnInit, signal } from '@angular/core';
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
  // Utilisation de signaux pour l’animal, l’habitat et la note du vétérinaire
  animal = signal<Animal | undefined>(undefined);
  habitat = signal<Habitat | undefined>(undefined);
  vetNote = signal<VetNote | undefined>(undefined);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private animalService: AnimalService // Injection du service
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id')); // Récupération de l'ID depuis l'URL
    console.log('Route param ID:', id);

    // Chargement de l'animal par ID
    this.loadAnimal(id);
  }

  // Charger l’animal par son ID
  private loadAnimal(id: number) {
    this.animalService.getAnimalById(id).subscribe({
      next: (animal) => {
        this.animal.set(animal);

        // Si l'animal existe, trouver l'habitat associé
        if (animal) {
          this.loadHabitat(animal.habitatId);
        }
      },
      error: (error) =>
        console.error("Erreur lors de la récupération de l'animal :", error),
    });
  }

  // Charger l’habitat associé à l’animal
  private loadHabitat(habitatId: number | undefined) {
    if (habitatId != null) {
      const habitat = HABITATS.find((hab) => hab.id === habitatId);
      this.habitat.set(habitat);
    }
  }

  // Retour à la page d'accueil
  goBack() {
    this.router.navigate(['/']);
  }

  // Redirection vers la page de l'habitat
  goHabitat() {
    const habitatId = this.habitat()?.id;
    if (habitatId) {
      this.router.navigate(['/habitat', habitatId]);
    }
  }
}
