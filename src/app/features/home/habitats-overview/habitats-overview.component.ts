import { Component, OnInit, signal } from '@angular/core';
import { Habitat } from '../../../core/models/habitat.model';
import { BorderCardDirective } from '../../../shared/directives/border-card-habitat/border-card-habitat.directive';
import { RouterLink } from '@angular/router';
import { HabitatService } from '../../habitats/service/habitat.service';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-habitats-overview',
  standalone: true,
  imports: [BorderCardDirective, RouterLink],
  templateUrl: './habitats-overview.component.html',
})
export class HabitatsOverviewComponent implements OnInit {
  // Déclare habitats comme un signal pour gérer et réagir aux changements de données
  habitats = signal<Habitat[]>([]);

  constructor(private habitatService: HabitatService) {}

  ngOnInit() {
    // Récupérer les habitats depuis le service et mettre à jour le signal habitats
    this.habitatService.getHabitats().subscribe((data) => {
      // Formate l'URL de l'image de chaque habitat et met à jour le signal
      this.habitats.set(
        data.map((habitat) => ({
          ...habitat,
          image: habitat.images.startsWith('http')
            ? habitat.images
            : `${environment.apiUrl}/uploads/img-habitats/${habitat.images}`,
        }))
      );
    });
  }
}
