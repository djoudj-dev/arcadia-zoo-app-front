import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  AfterViewInit,
  Input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ModalService } from '../modal.service';
import { RateComponent } from '../../shared/components/rate/rate.component';
import { Review } from '../../core/models/review.model';
import { ReviewService } from '../review/review.service';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [ButtonComponent, FormsModule, RateComponent],
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.css'],
})
export class AddReviewComponent implements OnInit, AfterViewInit {
  @Input() stars: number[] = [1, 2, 3, 4, 5];
  @ViewChild('reviewForm') private reviewForm!: ElementRef<HTMLFormElement>;

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
    if (this.reviewForm && this.reviewForm.nativeElement) {
      this.reviewForm.nativeElement.reset();
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

    if (this.reviewForm && this.reviewForm.nativeElement) {
      this.reviewForm.nativeElement.reset();
    }

    setTimeout(() => {
      this.modalService.closeModal();
    }, 2500);
  }

  closeModal() {
    this.modalService.closeModal();
  }
}
