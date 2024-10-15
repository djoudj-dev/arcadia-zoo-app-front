import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Service } from '../../../core/models/service.model';
import { SERVICES } from '../../../core/mocks/services-mock.component';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  constructor() {}

  // Récupérer la liste de tous les services
  getServices(): Observable<Service[]> {
    return of(SERVICES);
  }

  // Récupérer un service spécifique par son ID
  getServiceById(id: number): Observable<Service | undefined> {
    const service = SERVICES.find((service) => service.id === id);
    return of(service);
  }

  // Ajouter un nouveau service (utile pour l'espace admin)
  addService(service: Service): void {
    SERVICES.push(service);
  }

  // Mettre à jour un service existant
  updateService(updatedService: Service): void {
    const index = SERVICES.findIndex(
      (service) => service.id === updatedService.id
    );
    if (index !== -1) {
      SERVICES[index] = updatedService;
    }
  }

  // Supprimer un service par son ID
  deleteService(id: number): void {
    const index = SERVICES.findIndex((service) => service.id === id);
    if (index !== -1) {
      SERVICES.splice(index, 1);
    }
  }
}
