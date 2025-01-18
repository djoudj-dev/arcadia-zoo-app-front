import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ToastService } from '../../../../shared/components/toast/services/toast.service';
import { UserOpinion } from '../models/user-opinions.model';

@Injectable({
  providedIn: 'root',
})
export class UserOpinionsService {
  readonly apiUrl = `${environment.apiUrl}/api/user-opinions`;
  readonly opinionsUpdatedSource = new Subject<void>();
  opinionsUpdated$ = this.opinionsUpdatedSource.asObservable();

  constructor(readonly http: HttpClient, readonly toastService: ToastService) {}

  private transformOpinion(opinion: UserOpinion): UserOpinion {
    return {
      ...opinion,
      id_opinion: Number(opinion._id) || 0,
      name: opinion.name ?? '',
      message: opinion.message ?? opinion.content ?? '',
      date: opinion.date ?? opinion.createdAt ?? new Date(),
      rating: opinion.rating ? Number(opinion.rating) : 0,
      validated: Boolean(opinion.validated),
      rejected: Boolean(opinion.rejected),
    };
  }

  getUserOpinions(): Observable<UserOpinion[]> {
    return this.http
      .get<UserOpinion[]>(`${this.apiUrl}/validated`, {
        params: {
          validated: 'true',
          rejected: 'false',
        },
      })
      .pipe(
        map((opinions) => opinions.map(this.transformOpinion)),

        catchError((error) => {
          console.error('Erreur lors de la récupération des avis:', error);
          this.toastService.showError(
            'Impossible de charger les avis utilisateurs'
          );
          throw error;
        })
      );
  }

  addUserOpinions(userOpinions: UserOpinion): Observable<UserOpinion> {
    console.log('Opinion à envoyer:', userOpinions);
    return this.http.post<UserOpinion>(this.apiUrl, userOpinions).pipe(
      tap((opinion) => {
        console.log('Avis ajouté avec succès:', opinion);
        this.toastService.showSuccess('Votre avis a été ajouté avec succès');
      }),
      catchError((error) => {
        console.error("Erreur lors de l'envoi de l'avis", error);
        this.toastService.showError(
          "Une erreur est survenue lors de l'envoi de votre avis"
        );
        throw error;
      })
    );
  }

  validateUserOpinions(id: string): Observable<UserOpinion> {
    return this.http
      .patch<UserOpinion>(`${this.apiUrl}/validate/${id}`, {})
      .pipe(
        tap((opinion) => {
          console.log('Avis validé avec succès:', opinion);
          this.toastService.showSuccess('Avis validé avec succès');
          this.notifyOpinionsUpdated();
        }),
        catchError((error) => {
          console.error("Erreur lors de la validation de l'avis", error);
          this.toastService.showError(
            "Une erreur est survenue lors de la validation de l'avis"
          );
          return throwError(() => error);
        })
      );
  }

  getAllUserOpinions(): Observable<UserOpinion[]> {
    return this.http
      .get<UserOpinion[]>(`${this.apiUrl}/all`, {
        params: {
          sort: 'date,desc',
        },
      })
      .pipe(
        map((opinions) => opinions.map(this.transformOpinion)),
        catchError((error) => {
          console.error('Erreur lors de la récupération des avis:', error);
          this.toastService.showError('Impossible de charger les avis');
          throw error;
        })
      );
  }
  getPendingOpinions(): Observable<UserOpinion[]> {
    return this.http.get<UserOpinion[]>(`${this.apiUrl}/pending`).pipe(
      map((opinions) => opinions.map(this.transformOpinion)),
      tap((opinions) => {
        console.log('Liste finale des avis transformés:', opinions);
      }),
      catchError((error) => {
        console.error('Erreur lors de la récupération des avis:', error);
        this.toastService.showError(
          'Impossible de charger les avis en attente'
        );
        throw error;
      })
    );
  }

  rejectUserOpinions(id: string): Observable<UserOpinion> {
    return this.http.patch<UserOpinion>(`${this.apiUrl}/reject/${id}`, {}).pipe(
      tap((opinion) => {
        console.log('Avis rejeté avec succès:', opinion);
        this.notifyOpinionsUpdated();
      }),
      catchError((error) => {
        console.error("Erreur lors du rejet de l'avis", error);
        this.toastService.showError(
          "Une erreur est survenue lors du rejet de l'avis"
        );
        return throwError(() => error);
      })
    );
  }

  deleteUserOpinions(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.notifyOpinionsUpdated();
      })
    );
  }

  notifyOpinionsUpdated() {
    this.opinionsUpdatedSource.next();
  }
}
