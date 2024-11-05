import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Habitat } from '../../core/models/habitat.model';
import { HabitatService } from './service/habitat.service';
import { environment } from '../../../environments/environment.development';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-habitats',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './habitats.component.html',
})
export class HabitatsComponent implements OnInit {
  /**
   * Signal pour stocker la liste des habitats.
   * Utilisé pour suivre les modifications réactives et mettre à jour l'affichage en temps réel.
   */
  habitats = signal<Habitat[]>([]);

  /**
   * URL de base pour les images, dérivée de l'environnement de développement.
   * Elle est utilisée pour concaténer l'URL complète des images d'habitats.
   */
  private imageBaseUrl = environment.apiUrl;

  /**
   * Constructeur du composant, injectant les services nécessaires.
   * @param habitatService - Service pour gérer les opérations liées aux habitats.
   * @param router - Service de navigation Angular.
   */
  constructor(private habitatService: HabitatService, private router: Router) {}

  /**
   * Hook de cycle de vie Angular appelé à l'initialisation du composant.
   * Charge la liste des habitats depuis le backend.
   */
  ngOnInit(): void {
    this.loadHabitats();
  }

  /**
   * Charge la liste des habitats depuis le backend.
   * Récupère les données d'habitat et met à jour le signal `habitats` avec les URLs complètes des images.
   */
  private loadHabitats(): void {
    this.habitatService.getHabitats().subscribe({
      next: (habitats) => {
        this.habitats.set(
          habitats.map((habitat) => ({
            ...habitat,
            images: habitat.images.startsWith('http')
              ? habitat.images
              : `${this.imageBaseUrl}/${habitat.images}`,
          }))
        );
      },
      error: (error) =>
        console.error('Erreur lors de la récupération des habitats:', error),
    });
  }

  /**
   * Navigue vers la page d'accueil.
   * Utilisé pour le bouton de retour.
   */
  goBack(): void {
    this.router.navigate(['/']);
  }
}
