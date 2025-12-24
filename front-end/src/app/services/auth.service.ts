import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
export interface User {
  username: string;
  email: string;
}

interface LoginResponse {
  access_token: string;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  // private apiUrl = 'http://localhost:3000/auth';
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
    if (username && email) {
      return { username, email };
    }
    return null;
  }
  

  // Login
  // login(email: string, password: string): Observable<LoginResponse> {
  //   return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
  //     .pipe(
  //       tap(res => {
  //         // Guardamos token y usuario en localStorage
  //         localStorage.setItem('token', res.access_token);
  //         localStorage.setItem('username', res.username);
  //         localStorage.setItem('email', res.email);

  //         // Actualizamos BehaviorSubjects
  //         this.tokenSubject.next(res.access_token);
  //         this.userSubject.next({ username: res.username, email: res.email });
  //       })
  //     );
  // }

  login(email: string, password: string): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
    .pipe(
      tap(res => {
        console.log('✅ LOGIN OK', res);
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('username', res.username);
        localStorage.setItem('email', res.email);

        this.tokenSubject.next(res.access_token);
        this.userSubject.next({ username: res.username, email: res.email });
      }),
      catchError(err => {
        console.error('❌ LOGIN ERROR', err);
        throw err;
      })
    );
  }


  // Registro
  // register(email: string, password: string, username: string): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/register`, { email, password, username });
  // }

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

  // Actualizar el usuario globalmente desde componentes (por ejemplo tras cambiar username o email)
  updateCurrentUser(user: Partial<User>) {
    const current = this.userSubject.value;
    if (!current) return;

    const updatedUser = { ...current, ...user };
    localStorage.setItem('username', updatedUser.username);
    localStorage.setItem('email', updatedUser.email);
    this.userSubject.next(updatedUser);
  }
}
