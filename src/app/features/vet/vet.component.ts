// Dans le composant VetComponent
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { VetNote } from '../../core/models/vetnote.model';
import { Vet } from '../../core/models/vet.model';
import { MOCK_VET_NOTES } from '../../reviews/mocks/vet-note-mock.component';
import { MOCK_VETS } from '../../reviews/mocks/vet-mock.component';
import { Animal } from '../../core/models/animal.model';
import { ANIMALS } from '../../reviews/mocks/animals-mock.component';
import { DatePipe } from '@angular/common';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  selector: 'app-vet',
  templateUrl: './vet.component.html',
})
export class VetComponent implements OnInit {
  vetNotes: VetNote[] = MOCK_VET_NOTES.map((note) => ({
    ...note,
    showDetails: false,
  })); // Initialiser showDetails à false
  vets: Vet[] = MOCK_VETS;
  selectedVet: Vet | null = null;
  vetNoteForm: FormGroup;
  animals: Animal[] = ANIMALS;

  constructor(private fb: FormBuilder) {
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
    // Initialisation si nécessaire
  }

  // Méthode pour assigner un vétérinaire en fonction de l'animal
  assignVetByAnimalId(animalId: number) {
    const assignedVet = this.vets.find((vet) =>
      vet.animalsSpecializedIn.includes(animalId)
    );
    this.selectedVet = assignedVet || null;
  }

  onSubmit() {
    const animalId = this.vetNoteForm.value.animalId;
    this.assignVetByAnimalId(animalId);

    if (!this.vetNoteForm.valid || !this.selectedVet) return;

    // Ajout d'une nouvelle note vétérinaire avec showDetails initialisé à false
    this.vetNotes.push({
      id: this.vetNotes.length + 1,
      vetId: this.selectedVet.id,
      showDetails: false, // Initialiser showDetails à false
      ...this.vetNoteForm.value,
    });

    this.vetNoteForm.reset({ visitDate: new Date() });
  }

  // Méthode pour basculer l'affichage des détails d'une note
  toggleDetails(note: VetNote) {
    note.showDetails = !note.showDetails;
  }

  trackByNoteId(index: number, note: VetNote): number {
    return note.id;
  }
}
