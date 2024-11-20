import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { Observable } from 'rxjs';
import {
  ContactForm,
  ContactResponse,
  PasswordChangeForm,
  PasswordChangeResponse,
} from '../models/contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  sendContactEmail(formData: ContactForm): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(`${this.apiUrl}/contact`, formData);
  }

  sendPasswordChangeConfirmation(
    passwordData: PasswordChangeForm
  ): Observable<PasswordChangeResponse> {
    return this.http.post<PasswordChangeResponse>(
      `${this.apiUrl}/admin/account-management/update-password`,
      passwordData
    );
  }
}
