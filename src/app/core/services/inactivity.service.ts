import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { fromEvent, merge, Subscription, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class InactivityService {
  private readonly timeoutDuration = 300000;
  private inactivitySubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
    private toastService: ToastService
  ) {}

  public startMonitoring(): void {
    this.inactivitySubscription = this.ngZone.runOutsideAngular(() => {
      const userActivity$ = merge(
        fromEvent(window, 'mousemove'),
        fromEvent(window, 'keydown')
      );

      const inactivityTimer$ = userActivity$.pipe(
        tap(() => console.log('Activité détectée, réinitialisation du timer')),
        switchMap(() => timer(this.timeoutDuration))
      );

      return inactivityTimer$.subscribe(() => {
        this.ngZone.run(() => {
          console.log("Inactivité détectée, déconnexion de l'utilisateur");
          this.authService.logout();
          this.toastService.showError(
            "Vous avez été déconnecté en raison de l'inactivité."
          );
          this.router.navigate(['/login']);
        });
      });
    });
  }

  public stopMonitoring(): void {
    if (this.inactivitySubscription) {
      this.inactivitySubscription.unsubscribe();
      console.log("Surveillance d'inactivité arrêtée.");
    }
  }
}
