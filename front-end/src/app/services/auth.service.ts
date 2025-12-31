import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export interface User {
  username: string;
  email: string;
  displayName?: string;
  profileImage?: string | null;
}

interface LoginResponse {
  access_token: string;
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

  private userSubject = new BehaviorSubject<User | null>(this.loadUserFromStorage());
  public currentUser$ = this.userSubject.asObservable();

  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  private loadUserFromStorage(): User | null {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const displayName = localStorage.getItem('displayName') || undefined;
    const profileImage = localStorage.getItem('profileImage') || undefined;
    
    if (username && email) {
      return { 
        username, 
        email, 
        displayName, 
        profileImage: profileImage || null 
      };
    }
    return null;
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(res => {
          console.log('✅ LOGIN OK', res);
          
          localStorage.setItem('token', res.access_token);
          localStorage.setItem('username', res.username);
          localStorage.setItem('email', res.email);
          
          if (res.displayName) {
            localStorage.setItem('displayName', res.displayName);
          }
          
          if (res.profileImage) {
            localStorage.setItem('profileImage', res.profileImage);
          } else {
            localStorage.removeItem('profileImage');
          }

          this.tokenSubject.next(res.access_token);
          this.userSubject.next({ 
            username: res.username, 
            email: res.email,
            displayName: res.displayName,
            profileImage: res.profileImage || null
          });
        }),
        catchError(err => {
          console.error('❌ LOGIN ERROR', err);
          throw err;
        })
      );
  }

  register(email: string, password: string, username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password, username })
      .pipe(
        tap(res => {
          console.log('✅ REGISTER OK', res);
        }),
        catchError((err: HttpErrorResponse) => {
          console.error('❌ REGISTER ERROR', err);
          return throwError(() => err);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('displayName');
    localStorage.removeItem('profileImage');
    
    this.tokenSubject.next(null);
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  updateCurrentUser(user: Partial<User>) {
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

  refreshUserProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/profile`).pipe(
      tap(profile => {
        if (profile) {
          this.updateCurrentUser({
            displayName: profile.displayName,
            profileImage: profile.profileImage
          });
        }
      })
    );
  }
}