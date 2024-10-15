import { Component, OnInit } from '@angular/core';
import { Habitat } from '../../../core/models/habitat.model';
import { BorderCardDirective } from '../../../shared/directives/border-card-habitat/border-card-habitat.directive';
import { RouterLink } from '@angular/router';
import { HabitatService } from '../../habitats/service/habitat.service';

@Component({
  selector: 'app-habitats-overview',
  standalone: true,
  imports: [BorderCardDirective, RouterLink],
  templateUrl: './habitats-overview.component.html',
})
export class HabitatsOverviewComponent implements OnInit {
  habitats: Habitat[] = [];

  constructor(private habitatService: HabitatService) {} // Injection du service

  ngOnInit(): void {
    // Utilisation du service pour récupérer les habitats au chargement du composant
    this.habitatService.getHabitats().subscribe((data) => {
      this.habitats = data;
    });
  }
}
