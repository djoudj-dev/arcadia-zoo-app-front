import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { VetNote } from '../../core/models/vetnote.model';
import { Vet } from '../../core/models/vet.model';
import { MOCK_VET_NOTES } from '../../core/mocks/vet-note-mock.component';
import { MOCK_VETS } from '../../core/mocks/vet-mock.component';
import { Animal } from '../../core/models/animal.model';
import { ANIMALS } from '../../core/mocks/animals-mock.component';
import { DatePipe } from '@angular/common';
import { BorderCardAnimalDirective } from '../../shared/directives/border-card-animal/border-card-animal.directive';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, BorderCardAnimalDirective],
  selector: 'app-vet',
  templateUrl: './vet.component.html',
})
export class VetComponent implements OnInit {
  vetNotes: VetNote[] = []; // Stockage des notes de vétérinaires
  vets: Vet[] = MOCK_VETS; // Vétérinaires disponibles
  animals: Animal[] = ANIMALS; // Liste des animaux
  selectedVet: Vet | null = null; // Vétérinaire sélectionné
  vetNoteForm: FormGroup; // Formulaire pour remplir les notes vétérinaires

  constructor(private fb: FormBuilder) {
    // Initialisation du formulaire avec les contrôles et leurs validations
    this.vetNoteForm = this.fb.group({
      animalId: ['', Validators.required],
      animalState: ['', Validators.required],
      food: ['', Validators.required],
      foodWeight: [null, [Validators.required, Validators.min(0.1)]],
      visitDate: [new Date(), Validators.required],
      additionalDetails: [''],
    });
  }

  ngOnInit(): void {
    // Initialisation des notes vétérinaires avec showDetails à false
    this.vetNotes = MOCK_VET_NOTES.map((note) => ({
      ...note,
      showDetails: false,
    }));
  }

  /**
   * Méthode pour assigner un vétérinaire en fonction de l'ID de l'animal
   * @param animalId - ID de l'animal sélectionné
   */
  assignVetByAnimalId(animalId: number) {
    // Rechercher un vétérinaire spécialisé dans l'animal
    const assignedVet = this.vets.find((vet) =>
      vet.animalsSpecializedIn.includes(animalId)
    );
    this.selectedVet = assignedVet || null; // Si aucun vétérinaire trouvé, réinitialiser à null
  }

  /**
   * Méthode appelée lors de la soumission du formulaire.
   * Elle crée une nouvelle note vétérinaire si tout est valide.
   */
  onSubmit() {
    // Assigner le vétérinaire en fonction de l'ID de l'animal sélectionné
    const animalId = this.vetNoteForm.value.animalId;
    this.assignVetByAnimalId(animalId);

    // Si le formulaire est invalide ou si aucun vétérinaire n'est sélectionné, arrêter ici
    if (!this.vetNoteForm.valid || !this.selectedVet) return;

    // Ajouter la nouvelle note vétérinaire avec showDetails initialisé à false
    this.vetNotes.push({
      id: this.vetNotes.length + 1, // Générer un ID unique
      vetId: this.selectedVet.id,
      showDetails: false, // Masquer les détails par défaut
      ...this.vetNoteForm.value,
    });

    // Réinitialiser le formulaire après soumission, avec la date actuelle pour visitDate
    this.vetNoteForm.reset({ visitDate: new Date() });
  }

  /**
   * Méthode pour afficher/masquer les détails d'une note vétérinaire.
   * @param note - La note dont on souhaite basculer l'affichage des détails.
   */
  toggleDetails(note: VetNote) {
    note.showDetails = !note.showDetails; // Basculer l'état de showDetails
  }

  trackByNoteId(index: number, note: VetNote): number {
    return note.id;
  }
}
