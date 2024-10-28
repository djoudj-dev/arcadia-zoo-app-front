import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Habitat } from '../../../core/models/habitat.model';
import { HabitatManagementService } from '../service/habitat-management.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, SlicePipe } from '@angular/common';
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
  styleUrl: './habitat-management.component.css',
})
export class HabitatManagementComponent implements OnInit {
  habitatList: Habitat[] = [];
  newHabitat: Partial<Habitat> = {};
  selectedFile: File | null = null;

  constructor(
    private router: Router,
    private habitatManagement: HabitatManagementService
  ) {}

  ngOnInit() {
    this.loadHabitats();
  }

  // Charger la liste des habitats
  loadHabitats() {
    this.habitatManagement.getAllHabitats().subscribe((habitats: Habitat[]) => {
      this.habitatList = habitats.map((habitat) => ({
        ...habitat, // Utilisez des parenthèses pour encapsuler l'objet
        image: `${environment.apiUrl}/uploads/${habitat.image}`,
      }));
    });
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.newHabitat.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedFile = null;
      this.newHabitat.image = '';
    }
  }

  // Création d'un habitat
  createHabitat() {
    const { name, description, image } = this.newHabitat;

    if (name && description && image) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('image', image);

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.habitatManagement.createHabitat(formData).subscribe(
        (habitat) => {
          this.habitatList.push(habitat);
          this.newHabitat = {};
          this.selectedFile = null;
        },
        (error) => {
          console.error("Erreur lors de la création de l'habitat :", error);
        }
      );
    } else {
      console.error('Veuillez remplir tous les champs');
    }
  }

  // Mise à jour de la liste des habitats
  updateHabitat() {
    const { name, description, image } = this.newHabitat;

    if (name && description && image) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('image', image);

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.habitatManagement.createHabitat(formData).subscribe(
        (habitat) => {
          this.habitatList.push(habitat);
          this.newHabitat = {};
          this.selectedFile = null;
        },
        (error) => {
          console.error("Erreur lors de la création de l'habitat :", error);
        }
      );
    } else {
      console.error('Veuillez remplir tous les champs');
    }
  }

  // Remplir le formulaire de mise à jour avec les données de l'habitat sélectionné
  editHabitat(habitatId: number) {
    const habitat = this.habitatList.find((h) => h.id === habitatId);
    if (habitat) {
      this.newHabitat = { ...habitat };
    }
  }

  // Supprimer un habitat
  deleteHabitat(habitatId: number) {
    this.habitatManagement.deleteHabitat(habitatId.toString()).subscribe(
      () => {
        console.log('Habitat supprimé');
        this.habitatList = this.habitatList.filter(
          (habitat) => habitat.id !== habitatId
        );
        this.loadHabitats(); // Recharger la liste des habitats
      },
      (error) => {
        console.error("Erreur lors de la suppression de l'habitat:", error);
      }
    );
  }

  // Gestion dynamique de l'affichage des descriptions
  toggleDescription(habitatId: number) {
    const habitat = this.habitatList.find((h) => h.id === habitatId);
    if (habitat) {
      habitat.showDescription = !habitat.showDescription;
    }
  }

  // Annuler la mise à jour de l'habitat
  cancel() {
    this.newHabitat = {};
    this.selectedFile = null;
  }

  // Retour a l'accueil dashboard
  goBack() {
    this.router.navigate(['/admin']);
  }
}
