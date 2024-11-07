import { Component, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { DatePipe, SlicePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment.development';
import { Router } from '@angular/router';
import { StatsService } from '../stats/services/stats.service';
import { HabitatManagementService } from './service/habitat-management.service';
import { Habitat } from './model/habitat.model';

@Component({
  selector: 'app-habitat-management',
  standalone: true,
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    FormsModule,
    SlicePipe,
    DatePipe,
  ],
  templateUrl: './habitat-management.component.html',
})
export class HabitatManagementComponent implements OnInit {
  // Signaux pour stocker la liste des habitats
  habitats = signal<Habitat[]>([]);
  selectedFile = signal<File | null>(null);

  // Objet intermédiaire pour le formulaire
  newHabitatData: Partial<Habitat> = {};

  // Chemin d'accès aux images (dérivé de l'environnement)
  imageBaseUrl = `${environment.apiUrl}`;

  constructor(
    private router: Router,
    private habitatManagement: HabitatManagementService,
    private statsService: StatsService
  ) {}

  ngOnInit() {
    this.loadHabitats();
  }

  // Charger la liste des habitats
  loadHabitats() {
    this.habitatManagement.getAllHabitats().subscribe({
      next: (habitats) => {
        this.habitats.set(
          habitats.map((habitat) => ({
            ...habitat,
            showDescription: false,
            images: `${this.imageBaseUrl}/${habitat.images}`,
          }))
        );
      },
      error: (error) =>
        console.error('Erreur lors de la récupération des habitats:', error),
    });
  }

  // Gestion du changement de fichier
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
      console.log('Fichier sélectionné :', input.files[0]);
    }
  }

  // Création d'un nouvel habitat
  createHabitat() {
    if (
      this.newHabitatData.name &&
      this.newHabitatData.description &&
      this.selectedFile()
    ) {
      const formData = new FormData();
      formData.append('name', this.newHabitatData.name);
      formData.append('description', this.newHabitatData.description);
      const file = this.selectedFile();
      if (file) {
        formData.append('images', file);
      }

      console.log('Fichier sélectionné :', file);

      this.habitatManagement.createHabitat(formData).subscribe({
        next: (response) => {
          console.log('Habitat créé avec succès:', response);
          this.resetForm();
          this.loadHabitats();
          this.statsService.incrementTotalHabitats();
        },
        error: (error) => {
          console.error("Erreur lors de la création de l'habitat :", error);
        },
      });
    } else {
      console.error('Veuillez remplir tous les champs');
    }
  }

  // Mettre à jour un habitat existant
  updateHabitat() {
    const { id_habitat, name, description } = this.newHabitatData;
    if (id_habitat && name && description) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);

      const file = this.selectedFile();
      if (file) formData.append('images', file);

      this.habitatManagement
        .updateHabitat(id_habitat.toString(), formData)
        .subscribe({
          next: (updatedHabitat) => {
            this.habitats.update((habitats) =>
              habitats.map((h) =>
                h.id_habitat === updatedHabitat.id_habitat
                  ? {
                      ...updatedHabitat,
                      showDescription: h.showDescription,
                      images: `${this.imageBaseUrl}/${updatedHabitat.images}`,
                    }
                  : h
              )
            );
            this.resetForm();
          },
          error: (error) =>
            console.error(
              "Erreur lors de la mise à jour de l'habitat :",
              error
            ),
        });
    } else {
      console.error('Veuillez remplir tous les champs');
    }
  }

  // Remplir le formulaire de mise à jour avec les données de l'habitat sélectionné
  editHabitat(id_habitat: number) {
    const habitat = this.habitats().find((h) => h.id_habitat === id_habitat);
    if (habitat) this.newHabitatData = { ...habitat };
  }

  deleteHabitat(id_habitat: number | undefined) {
    if (id_habitat === undefined || id_habitat === null) {
      console.error('ID invalide pour la suppression :', id_habitat);
      return;
    }
    this.habitatManagement.deleteHabitat(id_habitat.toString()).subscribe({
      next: () => {
        console.log('Habitat supprimé');
        this.habitats.update((habitats) =>
          habitats.filter((habitat) => habitat.id_habitat !== id_habitat)
        );
        this.statsService.decrementTotalHabitats();
      },
      error: (error) =>
        console.error("Erreur lors de la suppression de l'habitat:", error),
    });
  }

  // Annuler l'édition
  cancel() {
    this.resetForm();
  }

  // Réinitialiser le formulaire
  resetForm() {
    this.newHabitatData = {}; // Réinitialiser les données du formulaire
    this.selectedFile.set(null);
  }

  // Afficher ou masquer la description de l'habitat
  toggleDescription(id_habitat: number) {
    this.habitats.update((habitats) =>
      habitats.map((habitat) =>
        habitat.id_habitat === id_habitat
          ? { ...habitat, showDescription: !habitat.showDescription }
          : habitat
      )
    );
  }

  // Retour à l'accueil du tableau de bord
  goBack() {
    this.router.navigate(['/admin']);
  }
}
