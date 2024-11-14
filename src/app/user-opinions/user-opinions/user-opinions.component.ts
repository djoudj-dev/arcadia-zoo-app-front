import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { RateComponent } from '../../shared/components/rate/rate.component';
import { AddReviewComponent } from '../add-user-opinions/add-user-opinions.component';
import { UserOpinions } from '../models/user-opinions.model';
import { ModalService } from '../services/modal.service';
import { UserOpinionsService } from '../services/user-opinions.service';

@Component({
  selector: 'app-user-opinions',
  templateUrl: './user-opinions.component.html',
  standalone: true,
  imports: [
    RateComponent,
    ButtonComponent,
    DatePipe,
    AddReviewComponent,
    AsyncPipe,
  ],
})
export class UserOpinionsComponent {
  readonly isReadOnly = signal<boolean>(true);
  readonly userOpinions = signal<UserOpinions[]>([]);
  readonly currentUserOpinionsIndex = signal<number>(0);
  readonly currentRating = signal<number>(0);

  constructor(
    private modalService: ModalService,
    private userOpinionsService: UserOpinionsService
  ) {
    this.userOpinionsService.getUserOpinions().subscribe((userOpinions) => {
      this.userOpinions.set(userOpinions);
      this.updateCurrentRating();
    });
  }

  private updateCurrentRating(): void {
    const opinions = this.userOpinions();
    const currentIndex = this.currentUserOpinionsIndex();
    this.currentRating.set(opinions[currentIndex]?.rating ?? 0);
  }

  changeUserOpinions(direction: 'previous' | 'next'): void {
    const userOpinions = this.userOpinions();
    if (direction === 'previous' && this.currentUserOpinionsIndex() > 0) {
      this.currentUserOpinionsIndex.set(this.currentUserOpinionsIndex() - 1);
      this.updateCurrentRating();
    } else if (
      direction === 'next' &&
      this.currentUserOpinionsIndex() < userOpinions.length - 1
    ) {
      this.currentUserOpinionsIndex.set(this.currentUserOpinionsIndex() + 1);
      this.updateCurrentRating();
    }
  }

  openModal() {
    this.modalService.openModal();
  }
}
