import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Habitat } from '../dashboard/admin-dashboard/habitat-management/model/habitat.model';
import { HabitatService } from './service/habitat.service';

@Component({
  selector: 'app-habitats',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './habitats.component.html',
})
export class HabitatsComponent implements OnInit {
  /** Signal pour stocker la liste des habitats **/
  habitats = signal<Habitat[]>([]);

  constructor(private habitatService: HabitatService, private router: Router) {}

  ngOnInit(): void {
    this.loadHabitats();
  }

  /**
   * Charge tous les habitats en utilisant le service.
   * Les URLs d'images sont déjà formatées par le service.
   */
  private loadHabitats(): void {
    this.habitatService.getHabitats().subscribe({
      next: (habitats) => this.habitats.set(habitats),
      error: (error) =>
        console.error('Erreur lors de la récupération des habitats:', error),
    });
  }

  /** Retourne à la page d'accueil **/
  goBack(): void {
    this.router.navigate(['/']);
  }
}
