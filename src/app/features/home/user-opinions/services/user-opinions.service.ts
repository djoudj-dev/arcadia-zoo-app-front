import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { Observable, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ToastService } from '../../../../shared/components/toast/services/toast.service';
import { UserOpinion } from '../models/user-opinions.model';

@Injectable({
  providedIn: 'root',
})
export class UserOpinionsService {
  private apiUrl = `${environment.apiUrl}/api/user-opinions`;
  private opinionsUpdatedSource = new Subject<void>();
  opinionsUpdated$ = this.opinionsUpdatedSource.asObservable();

  constructor(private http: HttpClient, private toastService: ToastService) {}

  private transformOpinion(opinion: UserOpinion): UserOpinion {
    return {
      ...opinion,
      id_opinion: Number(opinion._id) || 0,
      name: opinion.name || '',
      message: opinion.message || opinion.content || '',
      date: opinion.date || opinion.createdAt || new Date(),
      rating: Number(opinion.rating) || 0,
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
        tap((opinions) => {
          console.log('Avis validés récupérés:', opinions);
        }),
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
      .patch<UserOpinion>(`${this.apiUrl}/${id}/validate`, {
        validated: true,
      })
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
          throw error;
        })
      );
  }

  getAllUserOpinions(): Observable<UserOpinion[]> {
    return this.http
      .get<UserOpinion[]>(`${this.apiUrl}`, {
        params: {
          sort: 'date,desc',
        },
      })
      .pipe(
        map((opinions) => opinions.map(this.transformOpinion)),
        tap((opinions) => {
          console.log('Tous les avis récupérés:', opinions);
        }),
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
    return this.http
      .patch<UserOpinion>(`${this.apiUrl}/${id}/reject`, {
        rejected: true,
      })
      .pipe(
        tap((opinion) => {
          console.log('Avis rejeté avec succès:', opinion);
          this.notifyOpinionsUpdated();
        }),
        catchError((error) => {
          console.error("Erreur lors du rejet de l'avis", error);
          throw error;
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

  rejectUserOpinion(id: string): Observable<UserOpinion> {
    return this.http.patch<UserOpinion>(
      `${this.apiUrl}/user-opinions/${id}/reject`,
      {}
    );
  }

  notifyOpinionsUpdated() {
    this.opinionsUpdatedSource.next();
  }
}
