import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

// Interfaces actualizadas
export interface User {
  username: string;
  email: string;
  displayName?: string;      // Agregar
  profileImage?: string | null; // Agregar
}

interface LoginResponse {
  access_token: string;
  username: string;
  email: string;
  displayName?: string;      // Agregar
  profileImage?: string | null; // Agregar
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  // Estado actual del usuario
  private userSubject = new BehaviorSubject<User | null>(this.loadUserFromStorage());
  public currentUser$ = this.userSubject.asObservable();

  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Cargar usuario desde localStorage al iniciar la app
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

  // Login
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(res => {
          console.log('✅ LOGIN OK', res);
          
          // Guardar todo en localStorage
          localStorage.setItem('token', res.access_token);
          localStorage.setItem('username', res.username);
          localStorage.setItem('email', res.email);
          
          // Guardar displayName si existe
          if (res.displayName) {
            localStorage.setItem('displayName', res.displayName);
          }
          
          // Guardar profileImage si existe
          if (res.profileImage) {
            localStorage.setItem('profileImage', res.profileImage);
          } else {
            localStorage.removeItem('profileImage'); // Limpiar si es null/undefined
          }

          // Actualizar BehaviorSubjects
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

  // Registro
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

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('displayName');
    localStorage.removeItem('profileImage');
    
    this.tokenSubject.next(null);
    this.userSubject.next(null);
  }

  // Obtener token actual
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Comprobar si el usuario está logueado
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Obtener usuario actual de forma síncrona
  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  // Actualizar el usuario globalmente desde componentes
  updateCurrentUser(user: Partial<User>) {
    const current = this.userSubject.value;
    if (!current) return;

    const updatedUser = { ...current, ...user };
    
    // Actualizar localStorage
    localStorage.setItem('username', updatedUser.username);
    localStorage.setItem('email', updatedUser.email);
    
    if (updatedUser.displayName !== undefined) {
      localStorage.setItem('displayName', updatedUser.displayName || '');
    }
    
    if (updatedUser.profileImage !== undefined) {
      // Solo guardar si no es null/undefined
      if (updatedUser.profileImage) {
        localStorage.setItem('profileImage', updatedUser.profileImage);
      } else {
        localStorage.removeItem('profileImage');
      }
    }

    // Actualizar BehaviorSubject
    this.userSubject.next(updatedUser);
  }

  // Método para refrescar datos del usuario desde el backend
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