import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Habitat } from '../../../core/models/habitat.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note-habitat',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './note-habitat.component.html',
})
export class NoteHabitatComponent {
  @Input() habitats: Habitat[] = [];
  @Output() submitNote = new EventEmitter<{
    habitatId: number;
    message: string;
  }>();

  habitatNoteForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Initialisation du formulaire avec des validations pour chaque champ
    this.habitatNoteForm = this.fb.group({
      habitatId: ['', Validators.required], // Champ obligatoire pour la sélection d'un habitat
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
