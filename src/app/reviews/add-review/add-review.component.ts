import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  OnInit,
  AfterViewInit,
  Input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ModalService } from '../modal.service';
import { RateComponent } from '../../shared/components/rate/rate.component';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [ButtonComponent, FormsModule, RateComponent],
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.css'],
})
export class AddReviewComponent implements OnInit, AfterViewInit {
  successMessage: string = '';
  @Input() stars: number[] = [1, 2, 3, 4, 5];
  @ViewChild('reviewForm') private reviewForm!: ElementRef<HTMLFormElement>;
  @Output() add = new EventEmitter<{
    name: string;
    date: string;
    message: string;
    rating: number;
  }>();

  name: string = '';
  date: string = '';
  message: string = '';
  rating: number = 0;
  isModalOpen: boolean = false;

  constructor(private modalService: ModalService) {} // Injectez le service

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
    console.log('Add review');
    this.add.emit({
      name: this.name,
      date: this.date,
      message: this.message,
      rating: this.rating,
    });
    if (this.reviewForm && this.reviewForm.nativeElement) {
      this.reviewForm.nativeElement.reset();
    }
    this.successMessage = 'Votre avis a été envoyé avec succès !';
    setTimeout(() => {
      this.modalService.closeModal();
    }, 2500);
  }

  closeModal() {
    this.modalService.closeModal(); // Utilisez le service pour fermer le modal
  }
}
