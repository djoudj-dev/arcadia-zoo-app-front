import { Component, OnInit, signal } from '@angular/core';
import { Habitat } from '../../core/models/habitat.model';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { HabitatService } from './service/habitat.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-habitats',
  standalone: true, // Déclare ce composant comme standalone, sans dépendance à un NgModule
  imports: [RouterLink, ButtonComponent], // Importe les composants requis pour ce template
  templateUrl: './habitats.component.html',
})
export class HabitatsComponent implements OnInit {
  /**
   * Signal pour stocker la liste des habitats.
   * Utilisé pour réagir de manière réactive aux changements de la liste des habitats.
   */
  habitats = signal<Habitat[]>([]);

  /**
   * Constructeur injectant les services nécessaires.
   * @param habitatService Service pour gérer les opérations liées aux habitats
   * @param router Service de navigation Angular
   */
  constructor(private habitatService: HabitatService, private router: Router) {}

  /**
   * Lifecycle hook appelé à l'initialisation du composant.
   * Récupère la liste des habitats depuis le backend et met à jour le signal `habitats`.
   * Ajoute l'URL de base à chaque image d'habitat si l'URL n'est pas déjà complète.
   */
  ngOnInit(): void {
    this.habitatService.getHabitats().subscribe({
      next: (data) => {
        this.habitats.set(
          data.map((habitat) => ({
            ...habitat,
            image: habitat.image.startsWith('http')
              ? habitat.image
              : `${environment.apiUrl}/uploads/img-habitats/${habitat.image}`,
          }))
        );
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des habitats :', error);
      },
    });
  }

  /**
   * Redirige l'utilisateur vers la page d'accueil.
   * Utilisé pour le bouton de retour.
   */
  goBack(): void {
    this.router.navigate(['/']);
  }
}
