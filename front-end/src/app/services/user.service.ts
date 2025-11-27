import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/user-profile.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken() || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/user/profile`, {
      headers: this.getAuthHeaders()
    });
  }

  updateProfileFormData(formData: FormData): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.apiUrl}/user/profile`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  updateUsernameProfile(username: string): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.apiUrl}/user/profile`, { username }, {
      headers: this.getAuthHeaders()
    });
  }

  updateEmail(email: string): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.apiUrl}/user/profile`, { email }, {
      headers: this.getAuthHeaders()
    });
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/profile`, {
      headers: this.getAuthHeaders()
    });
  }
}
