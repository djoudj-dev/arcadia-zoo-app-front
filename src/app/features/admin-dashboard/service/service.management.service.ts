import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Service } from '../../../core/models/service.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceManagementService {
  private apiUrl = environment.apiUrl + '/admin/service-management';

  constructor(private http: HttpClient) {}

  getAllServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl);
  }

  getServiceById(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/${id}`);
  }

  createService(service: Service): Observable<Service> {
    return this.http.post<Service>(this.apiUrl, service);
  }

  updateService(service: Service): Observable<Service> {
    return this.http.put<Service>(`${this.apiUrl}/${service.id}`, service);
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
