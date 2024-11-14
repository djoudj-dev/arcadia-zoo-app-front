import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { RateComponent } from '../../../../shared/components/rate/rate.component';
import { AddUserOpinionsComponent } from '../add-user-opinions/add-user-opinions.component';
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
    AsyncPipe,
    ModalComponent,
    AddUserOpinionsComponent,
  ],
})
export class UserOpinionsComponent implements OnDestroy {
  readonly isReadOnly = signal<boolean>(true);
  readonly userOpinions = signal<UserOpinions[]>([]);
  readonly currentUserOpinionsIndex = signal<number>(0);
  readonly currentRating = signal<number>(0);
  isModalOpen = signal<boolean>(false);
  private modalSubscription: Subscription;

  constructor(
    private modalService: ModalService,
    private userOpinionsService: UserOpinionsService
  ) {
    this.userOpinionsService.getUserOpinions().subscribe((userOpinions) => {
      this.userOpinions.set(userOpinions);
      this.updateCurrentRating();
    });

    // Souscrire au service modal
    this.modalSubscription = this.modalService.isOpen$.subscribe((isOpen) => {
      this.isModalOpen.set(isOpen);
    });
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
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
    this.modalService.open();
  }

  closeModal() {
    this.modalService.close();
  }
}
