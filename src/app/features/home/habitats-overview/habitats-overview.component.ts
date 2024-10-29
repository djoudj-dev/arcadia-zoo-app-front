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
  // Définir habitats comme un signal
  habitats = signal<Habitat[]>([]);

  constructor(private habitatService: HabitatService) {}

  ngOnInit(): void {
    this.habitatService.getHabitats().subscribe((data) => {
      // Mettre à jour le signal habitats et formater les URLs d'images
      this.habitats.set(
        data.map((habitat) => ({
          ...habitat,
          image: habitat.image.startsWith('http')
            ? habitat.image
            : `${environment.apiUrl}/uploads/img-habitats/${habitat.image}`,
        }))
      );
    });
  }
}
