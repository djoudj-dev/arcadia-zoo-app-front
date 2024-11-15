import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ToastService } from '../../../../shared/components/toast/services/toast.service';
import { UserOpinions } from '../models/user-opinions.model';

@Injectable({
  providedIn: 'root',
})
export class UserOpinionsService {
  private apiUrl = `${environment.apiUrl}/api/user-opinions`;

  constructor(private http: HttpClient, private toastService: ToastService) {}

  getUserOpinions(): Observable<UserOpinions[]> {
    return this.http.get<UserOpinions[]>(`${this.apiUrl}?validated=true`).pipe(
      tap((opinions) => {
        console.log('Avis récupérés du backend:', opinions);
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

  addUserOpinions(userOpinions: UserOpinions): Observable<UserOpinions> {
    console.log('Opinion à envoyer:', userOpinions);
    return this.http.post<UserOpinions>(this.apiUrl, userOpinions).pipe(
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

  validateUserOpinions(id: number): Observable<UserOpinions> {
    return this.http
      .patch<UserOpinions>(`${this.apiUrl}/${id}`, { validated: true })
      .pipe(
        tap((opinion) => {
          console.log('Avis validé avec succès:', opinion);
          this.toastService.showSuccess('Avis validé avec succès');
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
}
