import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  AfterViewInit,
  Input,
} from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ModalService } from '../modal.service';
import { RateComponent } from '../../shared/components/rate/rate.component';
import { Review } from '../../core/models/review.model';
import { ReviewService } from '../review/review.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [ButtonComponent, RateComponent, FormsModule],
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.css'],
})
export class AddReviewComponent implements OnInit, AfterViewInit {
  @Input() stars: number[] = [1, 2, 3, 4, 5];
  @ViewChild('reviewForm', { static: true })
  reviewForm!: ElementRef<HTMLFormElement>;

  successMessage: string = '';
  errorMessage: string = '';
  name: string = '';
  date: string = '';
  message: string = '';
  rating: number = 0;
  accepted: boolean = false;
  isModalOpen: boolean = false;

  constructor(
    private modalService: ModalService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.modalService.modalOpen$.subscribe((isOpen) => {
      this.isModalOpen = isOpen;
    });
  }

  ngAfterViewInit() {
    // Réinitialiser le formulaire à l'ouverture de la modal
    if (this.reviewForm && this.isModalOpen) {
      this.resetForm();
    }
  }

  addReview() {
    if (!this.accepted) {
      this.errorMessage =
        'Vous devez accepter la publication de votre nom et commentaire pour envoyer votre avis.';
      return;
    }

    const newReview: Review = {
      id: Date.now(), // Utiliser un timestamp pour un ID unique
      name: this.name,
      date: this.date,
      message: this.message,
      rating: this.rating,
      accepted: this.accepted,
    };

    this.reviewService.addReview(newReview);

    this.successMessage = 'Votre avis a été envoyé avec succès !';
    this.errorMessage = '';

    // Réinitialiser le formulaire après l'envoi
    this.resetForm();

    // Fermez la modal après un certain temps
    setTimeout(() => {
      this.modalService.closeModal();
      this.successMessage = '';
      this.errorMessage = '';
    }, 2500);
  }

  closeModal() {
    this.modalService.closeModal();
  }

  resetForm() {
    // Réinitialisation des champs
    this.name = '';
    this.date = '';
    this.message = '';
    this.rating = 0;
    this.accepted = false;

    // Réinitialisation visuelle du formulaire
    if (this.reviewForm) {
      this.reviewForm.nativeElement.reset();
    }
  }
}
