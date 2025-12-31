import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  access_token: string;
  username?: string;
  email?: string;
  displayName?: string;
  profileImage?: string | null;
}

export interface CurrentUser {
  username: string;
  email: string;
  displayName?: string;
  profileImage?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  private userSubject = new BehaviorSubject<CurrentUser | null>(null);
  currentUser$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const displayName = localStorage.getItem('displayName') || '';
    const profileImage = localStorage.getItem('profileImage');

    if (username && email) {
      this.userSubject.next({ 
        username, 
        email, 
        displayName: displayName || undefined,
        profileImage: profileImage || undefined
      });
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('username', res.username || '');
        localStorage.setItem('email', res.email || '');
        localStorage.setItem('displayName', res.displayName || '');
        
        if (res.profileImage) {
          localStorage.setItem('profileImage', res.profileImage);
        } else {
          localStorage.removeItem('profileImage');
        }

        this.userSubject.next({
          username: res.username || '',
          email: res.email || '',
          displayName: res.displayName,
          profileImage: res.profileImage || undefined
        });
      })
    );
  }

  register(email: string, password: string, username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password, username });
  }

  logout() {
    localStorage.clear();
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
    
    if (updatedUser.displayName !== undefined) {
      localStorage.setItem('displayName', updatedUser.displayName || '');
    }
    
    if (updatedUser.profileImage !== undefined) {
      if (updatedUser.profileImage) {
        localStorage.setItem('profileImage', updatedUser.profileImage);
      } else {
        localStorage.removeItem('profileImage');
      }
    }

    this.userSubject.next(updatedUser);
  }
}