import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { Observable } from 'rxjs';

interface HabitatComment {
  id_habitat_comment: number;
  habitat_status: string;
  createdAt: Date;
  id_habitat: number;
  habitat_name: string;
  user_name: string;
}

@Injectable({
  providedIn: 'root',
})
export class HabitatHistoryService {
  private apiUrl = `${environment.apiUrl}/api/habitat-comment`;

  constructor(private http: HttpClient) {}

  getHabitatCommentHistory(): Observable<HabitatComment[]> {
    return this.http.get<HabitatComment[]>(this.apiUrl);
  }
}
