import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
export interface LoginResponse {
  access_token: string;
  username?: string;
  email?: string;
  displayName?: string;
  profileImage?: string;
}

export interface CurrentUser {
  username: string;
  email: string;
  displayName?: string;
  profileImage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  // private apiUrl = 'http://localhost:3000/auth';
  private apiUrl = `${environment.apiUrl}/auth`;

  private userSubject = new BehaviorSubject<CurrentUser | null>(null);
  currentUser$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const displayName = localStorage.getItem('displayName') || '';
    const profileImage = localStorage.getItem('profileImage') || '';

    if (username && email) {
      this.userSubject.next({ username, email, displayName, profileImage });
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('username', res.username || '');
        localStorage.setItem('email', res.email || '');
        localStorage.setItem('displayName', res.displayName || '');
        localStorage.setItem('profileImage', res.profileImage || '');

        this.userSubject.next({
          username: res.username || '',
          email: res.email || '',
          displayName: res.displayName,
          profileImage: res.profileImage
        });
      })
    );
  }

  register(email: string, password: string, username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password, username });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('displayName');
    localStorage.removeItem('profileImage');
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser(): CurrentUser | null {
    return this.userSubject.value;
  }

  updateCurrentUser(user: Partial<CurrentUser>) {
    const current = this.userSubject.value;
    if (!current) return;

    const updatedUser = { ...current, ...user };

    localStorage.setItem('username', updatedUser.username);
    localStorage.setItem('email', updatedUser.email);
    if (updatedUser.displayName !== undefined) localStorage.setItem('displayName', updatedUser.displayName);
    if (updatedUser.profileImage !== undefined) localStorage.setItem('profileImage', updatedUser.profileImage);

    this.userSubject.next(updatedUser);
  }
}
