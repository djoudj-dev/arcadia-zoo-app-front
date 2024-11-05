import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

import { Habitat } from '../../../../core/models/habitat.model';

@Component({
  selector: 'app-note-habitat',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule],
  templateUrl: './note-habitat.component.html',
})
export class NoteHabitatComponent {
  @Input() habitats: Habitat[] = [];
  @Output() submitNote = new EventEmitter<{
    habitat_id: number;
    message: string;
  }>();

  habitatNoteForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Initialisation du formulaire avec des validations pour chaque champ
    this.habitatNoteForm = this.fb.group({
      habitat_id: ['', Validators.required], // Champ obligatoire pour la sélection d'un habitat
      message: ['', [Validators.required, Validators.minLength(10)]], // Message obligatoire avec une longueur minimale
    });
  }

  // Méthode appelée lors de la soumission du formulaire
  onSubmit(): void {
    if (this.habitatNoteForm.valid) {
      // Si le formulaire est valide, émettre les données
      this.submitNote.emit(this.habitatNoteForm.value);
      console.log('Form submitted:', this.habitatNoteForm.value);
      this.habitatNoteForm.reset(); // Réinitialiser le formulaire après soumission
    } else {
      console.log('Form is invalid');
    }
  }
}
