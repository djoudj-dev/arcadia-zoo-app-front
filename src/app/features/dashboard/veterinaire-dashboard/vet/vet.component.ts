// import { DatePipe } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import {
//   FormBuilder,
//   FormGroup,
//   Validators,
//   ReactiveFormsModule,
// } from '@angular/forms';
// import { BorderCardAnimalDirective } from '../../../shared/directives/border-card-animal/border-card-animal.directive';
// import { ButtonComponent } from '../../../shared/components/button/button.component';
// import { ModalComponent } from '../../../shared/components/modal/modal.component';
// import { NoteHabitatComponent } from './note-habitat/note-habitat.component';
// import { VetNote } from '../../../core/models/vetnote.model';
// import { Vet } from '../../../core/models/vet.model';
// import { MOCK_VETS } from '../../../core/mocks/vet-mock.component';
// import { Animal } from '../../../core/models/animal.model';
// import { ANIMALS } from '../../../core/mocks/animals-mock.component';
// import { Habitat } from '../../../core/models/habitat.model';
// import { HABITATS } from '../../../core/mocks/habitats-mock.component';
// import { HabitatNoteService } from './note-habitat.service';
// import { MOCK_VET_NOTES } from '../../../core/mocks/vet-note-mock.component';
// import { HabitatNote } from '../../../core/models/habitat-note.model';

// @Component({
//   standalone: true,
//   selector: 'app-vet',
//   templateUrl: './vet.component.html',
//   imports: [
//     ReactiveFormsModule,
//     DatePipe,
//     BorderCardAnimalDirective,
//     ButtonComponent,
//     ModalComponent,
//     NoteHabitatComponent,
//   ],
// })
// export class VetComponent implements OnInit {
//   vetNotes: VetNote[] = [];
//   visibleVetNotes: VetNote[] = [];
//   vets: Vet[] = MOCK_VETS;
//   animals: Animal[] = ANIMALS;
//   habitats: Habitat[] = HABITATS;

//   selectedVet: Vet | null = null;
//   vetNoteForm: FormGroup;
//   isModalOpen = false;
//   notesToShow = 4;

//   constructor(
//     private fb: FormBuilder,
//     private habitatNoteService: HabitatNoteService // Service pour soumettre les avis sur l'habitat
//   ) {
//     this.vetNoteForm = this.fb.group({
//       animalId: ['', Validators.required],
//       animalState: ['', Validators.required],
//       food: ['', Validators.required],
//       foodWeight: [null, [Validators.required, Validators.min(0.1)]],
//       visitDate: [new Date(), Validators.required],
//       additionalDetails: [''],
//     });
//   }

//   ngOnInit(): void {
//     this.initializeVetNotes();
//   }

//   /**
//    * Initialise les notes vétérinaires avec les données mockées
//    */
//   private initializeVetNotes(): void {
//     this.vetNotes = MOCK_VET_NOTES.map((note) => ({
//       ...note,
//       showDetails: false, // Masquer les détails par défaut
//     }));
//     this.visibleVetNotes = this.vetNotes.slice(0, this.notesToShow);
//   }

//   /**
//    * Gère la soumission de l'avis d'habitat
//    */
//   handleSubmitHabitat(formData: { habitat_id: number; message: string }): void {
//     const habitat = this.habitats.find((h) => h.id === formData.habitat_id);

//     if (habitat) {
//       // Construction de l'objet HabitatNote avec les propriétés requises
//       const habitatNote: HabitatNote = {
//         id: Date.now(), // Utilisation de Date.now() pour générer un ID unique (ou une autre méthode de génération d'ID)
//         habitat_id: formData.habitat_id,
//         vetId: this.selectedVet?.id || 0, // Utilisez le vetId si disponible ou un autre identifiant
//         message: formData.message,
//         createdAt: new Date().toISOString(), // Ajout de la date de création
//       };

//       console.log(`Avis pour l'habitat ${habitat.name}:`, formData.message);

//       // Soumission de l'avis via le service
//       this.habitatNoteService.submitHabitatNote(habitatNote).subscribe(
//         (response) => {
//           console.log('Avis soumis avec succès:', response);
//         },
//         (error) => {
//           console.error('Erreur lors de la soumission:', error);
//         }
//       );
//     } else {
//       console.error('Habitat non trouvé pour ID:', formData.habitat_id);
//     }
//   }

//   /**
//    * Charge plus de notes vétérinaires
//    */
//   loadMore(): void {
//     const nextNotes = this.vetNotes.slice(
//       this.visibleVetNotes.length,
//       this.visibleVetNotes.length + this.notesToShow
//     );
//     this.visibleVetNotes = [...this.visibleVetNotes, ...nextNotes];
//   }

//   /**
//    * Réduit l'affichage des notes vétérinaires
//    */
//   showLess(): void {
//     this.visibleVetNotes = this.vetNotes.slice(0, this.notesToShow);
//   }

//   /**
//    * Assigne un vétérinaire en fonction de l'ID de l'animal
//    */
//   assignVetByAnimalId(animalId: number): void {
//     this.selectedVet =
//       this.vets.find((vet) => vet.animalsSpecializedIn.includes(animalId)) ||
//       null;
//   }

//   /**
//    * Gère la soumission d'une nouvelle note vétérinaire
//    */
//   onSubmit(): void {
//     const animalId = this.vetNoteForm.value.animalId;
//     this.assignVetByAnimalId(animalId);

//     if (this.vetNoteForm.valid && this.selectedVet) {
//       this.vetNotes.push({
//         id: this.vetNotes.length + 1,
//         vetId: this.selectedVet.id,
//         showDetails: false,
//         ...this.vetNoteForm.value,
//       });
//       this.vetNoteForm.reset({ visitDate: new Date() });
//       this.updateVisibleVetNotes();
//       this.closeModal(); // Ferme la modale après soumission
//     }
//   }

//   /**
//    * Met à jour les notes visibles
//    */
//   private updateVisibleVetNotes(): void {
//     this.visibleVetNotes = this.vetNotes.slice(0, this.visibleVetNotes.length);
//   }

//   /**
//    * Bascule l'affichage des détails d'une note
//    */
//   toggleDetails(note: VetNote): void {
//     note.showDetails = !note.showDetails;
//   }

//   /**
//    * Ouvre la modale
//    */
//   openModal(): void {
//     this.isModalOpen = true;
//   }

//   /**
//    * Ferme la modale
//    */
//   closeModal(): void {
//     this.isModalOpen = false;
//   }

//   /**
//    * TrackBy pour les performances dans *ngFor
//    */
//   trackByNoteId(index: number, note: VetNote): number {
//     return note.id;
//   }
// }
