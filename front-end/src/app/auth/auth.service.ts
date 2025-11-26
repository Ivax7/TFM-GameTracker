import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, Observable, BehaviorSubject } from 'rxjs';

interface LoginResponse {
  access_token: string;
  username?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/auth';

  // Aquí centralizamos el estado del usuario actual
  private userSubject = new BehaviorSubject<{ username: string; email: string } | null>(null);
  currentUser$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    // Cargar el usuario desde localStorage al iniciar la app
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    if (username) {
      this.userSubject.next({ username, email: email || '' });
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(res => {
          // Guardamos token + user en localStorage
          localStorage.setItem('token', res.access_token);
          localStorage.setItem('username', res.username || '');
          localStorage.setItem('email', res.email || '');

          // Emitimos el nuevo usuario
          this.userSubject.next({
            username: res.username || '',
            email: res.email || ''
          });
        })
      );
  }

  register(email: string, password: string, username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password, username });
  }

  logout() {
    // Borramos todo lo del usuario actual
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');

    // Emitimos null → cualquier componente que esté suscrito se actualiza
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser() {
    return this.userSubject.value;
  }
}
