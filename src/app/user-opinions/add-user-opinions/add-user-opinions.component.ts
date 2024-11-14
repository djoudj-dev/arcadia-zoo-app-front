import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { RateComponent } from '../../shared/components/rate/rate.component';
import { ModalService } from '../services/modal.service';
import { UserOpinionsService } from '../services/user-opinions.service';
import { UserOpinions } from '../models/user-opinions.model';

@Component({
  selector: 'app-add-user-opinions',
  standalone: true,
  templateUrl: './add-user-opinions.component.html',
  imports: [ReactiveFormsModule, ButtonComponent, RateComponent],
})
export class AddReviewComponent implements OnInit {
  addUserOpinionsForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  isModalOpen: boolean = false;

  // Déclaration de la propriété stars
  stars: number[] = [1, 2, 3, 4, 5]; // Par défaut, 5 étoiles

  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private userOpinionsService: UserOpinionsService
  ) {}

  ngOnInit() {
    // Initialisation du formulaire avec des validators
    this.addUserOpinionsForm = this.formBuilder.group({
      name: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ\\s\\-]+$')], // Regex pour les lettres et espaces uniquement
      ],
      date: ['', Validators.required], // Pas besoin de pattern ici car le type `date` est géré nativement
      message: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ], // Validation de longueur pour le commentaire
      ],
      rating: [0, Validators.required], // Note obligatoire
      accepted: [false, Validators.requiredTrue], // L'utilisateur doit cocher pour accepter les conditions
    });

    // Souscription à l'état de la modal
    this.modalService.modalOpen$.subscribe((isOpen) => {
      this.isModalOpen = isOpen;

      if (this.isModalOpen) {
        this.resetForm();
      }
    });
  }

  // Ajouter un nouvel avis
  addReview() {
    if (this.addUserOpinionsForm.invalid) {
      this.errorMessage = 'Veuillez remplir correctement le formulaire.';
      return;
    }

    const newReview: UserOpinions = {
      id: Date.now(), // Générer un ID unique
      ...this.addUserOpinionsForm.value, // Récupérer toutes les valeurs du formulaire
    };

    this.userOpinionsService.addUserOpinions(newReview);

    this.successMessage = 'Votre avis a été envoyé avec succès !';
    this.errorMessage = '';

    setTimeout(() => {
      this.modalService.closeModal();
      this.successMessage = '';
      this.resetForm();
    }, 2500);
  }

  // Méthode pour fermer la modal
  closeModal() {
    this.modalService.closeModal();
  }

  // Réinitialiser le formulaire
  resetForm() {
    this.addUserOpinionsForm.reset({
      rating: 0, // Réinitialisation à une note de 0 par défaut
      accepted: false, // Par défaut, la case n'est pas cochée
    });
  }

  // Fonction pour faciliter l'accès aux contrôles du formulaire dans le template
  get f() {
    return this.addUserOpinionsForm.controls;
  }
}
