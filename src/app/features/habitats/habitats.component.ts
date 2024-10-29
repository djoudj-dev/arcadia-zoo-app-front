import { Component, OnInit, signal } from '@angular/core';
import { Habitat } from '../../core/models/habitat.model';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { HabitatService } from './service/habitat.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-habitats',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './habitats.component.html',
})
export class HabitatsComponent implements OnInit {
  // Utiliser un signal pour stocker la liste des habitats
  habitats = signal<Habitat[]>([]);

  constructor(private habitatService: HabitatService, private router: Router) {}

  ngOnInit(): void {
    this.habitatService.getHabitats().subscribe((data) => {
      // Mettre à jour le signal habitats en ajoutant l'URL de base pour chaque image
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

  goBack(): void {
    this.router.navigate(['/']);
  }
}
