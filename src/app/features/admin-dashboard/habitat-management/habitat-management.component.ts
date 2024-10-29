import { Component, OnInit, signal } from '@angular/core';
import { Habitat } from '../../../core/models/habitat.model';
import { HabitatManagementService } from '../service/habitat-management.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { DatePipe, SlicePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment.development';
import { Router } from '@angular/router';

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
  // Signaux pour stocker la liste des habitats et le nouvel habitat
  habitats = signal<Habitat[]>([]);
  newHabitat = signal<Partial<Habitat>>({});
  selectedFile = signal<File | null>(null);

  // Chemin d'accès aux images (dérivé de l'environnement)
  imageBaseUrl = `${environment.apiUrl}/uploads/img-habitats`;

  constructor(
    private router: Router,
    private habitatManagement: HabitatManagementService
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
            // Utilise seulement le nom du fichier pour éviter le doublon
            image: `${this.imageBaseUrl}/${habitat.image.replace(
              /^.*uploads\/img-habitats\//,
              ''
            )}`,
          }))
        );
      },
      error: (error) =>
        console.error('Erreur lors de la récupération des habitats:', error),
    });
  }

  // Gestion du changement de fichier
  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    this.selectedFile.set(file);
  }

  // Création d'un nouvel habitat
  createHabitat() {
    const { name, description } = this.newHabitat();
    if (name && description) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);

      const file = this.selectedFile();
      if (file) formData.append('image', file);

      this.habitatManagement.createHabitat(formData).subscribe({
        next: (habitat) => {
          this.habitats.update((habitats) => [
            ...habitats,
            {
              ...habitat,
              showDescription: false,
              image: `${this.imageBaseUrl}/${habitat.image}`,
            },
          ]);
          this.newHabitat.set({});
          this.selectedFile.set(null);
        },
        error: (error) =>
          console.error("Erreur lors de la création de l'habitat :", error),
      });
    } else {
      console.error('Veuillez remplir tous les champs');
    }
  }

  // Mettre à jour un habitat existant
  updateHabitat() {
    const { id, name, description } = this.newHabitat();
    if (id && name && description) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);

      const file = this.selectedFile();
      if (file) formData.append('image', file);

      this.habitatManagement.updateHabitat(id.toString(), formData).subscribe({
        next: (updatedHabitat) => {
          this.habitats.update((habitats) =>
            habitats.map((h) =>
              h.id === updatedHabitat.id
                ? {
                    ...updatedHabitat,
                    showDescription: h.showDescription,
                    image: `${this.imageBaseUrl}/${updatedHabitat.image}`,
                  }
                : h
            )
          );
          this.newHabitat.set({});
          this.selectedFile.set(null);
        },
        error: (error) =>
          console.error("Erreur lors de la mise à jour de l'habitat :", error),
      });
    } else {
      console.error('Veuillez remplir tous les champs');
    }
  }

  deleteHabitat(id: number) {
    this.habitatManagement.deleteHabitat(id.toString()).subscribe({
      next: () => {
        console.log('Habitat supprimé');
        this.habitats.update((habitats) =>
          habitats.filter((habitat) => habitat.id !== id)
        );
      },
      error: (error) =>
        console.error("Erreur lors de la suppression de l'habitat:", error),
    });
  }

  // Remplir le formulaire de mise à jour avec les données de l'habitat sélectionné
  editHabitat(id: number) {
    const habitat = this.habitats().find((h) => h.id === id);
    if (habitat) this.newHabitat.set({ ...habitat });
  }

  // Annuler l'édition
  cancel() {
    this.newHabitat.set({});
    this.selectedFile.set(null);
  }

  // Afficher ou masquer la description de l'habitat
  toggleDescription(id: number) {
    this.habitats.update((habitats) =>
      habitats.map((habitat) =>
        habitat.id === id
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
