import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/profile`, { headers: this.getAuthHeaders() });
  }

  updateProfileFormData(formData: FormData) {
    return this.http.patch(`${this.apiUrl}/user/profile`, formData, { headers: this.getAuthHeaders() });
  }

}
