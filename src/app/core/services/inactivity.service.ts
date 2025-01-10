import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import {
  debounceTime,
  fromEvent,
  ReplaySubject,
  Subscription,
  timer,
} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  private readonly activitySubject = new ReplaySubject<void>(1);
  private readonly timeoutDuration = 300000;
  private readonly inactivitySubscription!: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly ngZone: NgZone,
    private readonly toastService: ToastService
  ) {}

  public startMonitoring(): void {
    const events = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'];

    events.forEach((event) => {
      fromEvent(window, event)
        .pipe(debounceTime(1000))
        .subscribe(() => this.activitySubject.next());
    });

    this.activitySubject
      .pipe(switchMap(() => timer(this.timeoutDuration)))
      .subscribe(() => this.handleInactivity());
  }

  private handleInactivity(): void {
    this.ngZone.run(() => {
      this.authService.logout();
      this.router.navigate(['/login']);
    });
  }

  public stopMonitoring(): void {
    if (this.inactivitySubscription) {
      this.inactivitySubscription.unsubscribe();
      console.log("Surveillance d'inactivité arrêtée.");
    }
  }
}
