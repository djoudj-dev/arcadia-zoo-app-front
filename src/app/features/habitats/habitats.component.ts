import { Component, OnInit } from '@angular/core';
import { Habitat } from '../../core/models/habitat.model';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component'; // Import du service
import { HabitatService } from './service/habitat.service';

@Component({
  selector: 'app-habitats',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './habitats.component.html',
})
export class HabitatsComponent implements OnInit {
  habitats: Habitat[] = [];

  constructor(
    private habitatService: HabitatService, // Utilisation du service
    private router: Router
  ) {}

  ngOnInit(): void {
    // Utiliser le service pour récupérer les habitats
    this.habitatService.getHabitats().subscribe((data) => {
      this.habitats = data;
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
