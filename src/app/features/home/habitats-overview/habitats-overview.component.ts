import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { BorderCardDirective } from '../../../shared/directives/border-card-habitat/border-card-habitat.directive';
import { Habitat } from '../../admin-dashboard/habitat-management/model/habitat.model';
import { HabitatService } from '../../habitats/service/habitat.service';

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
            : `${environment.apiUrl}/uploads/${habitat.images}`,
        }))
      );
    });
  }
}
