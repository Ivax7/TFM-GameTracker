import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserGameService {
  private apiUrl = `${environment.apiUrl}/user-games`;
  
  // BehaviorSubject para sincronización en tiempo real
  private reviewAddedSubject = new BehaviorSubject<any>(null);
  reviewAdded$ = this.reviewAddedSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  setGameStatus(
    gameId: number,
    status: string,
    name?: string,
    backgroundImage?: string,
    released?: string,
    rating?: number
  ): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.http.post(
      `${this.apiUrl}/status`,
      {
        gameId,
        status,
        name,
        backgroundImage,
        released,
        rating
      },
      { headers }
    );
  }

  getGamesByStatus(status: string): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/${status}`, { headers });
  }

  getGameStatus(gameId: number): Observable<{ status: string; rating: number | null; playtime: number; review?: string }> {
    const headers = this.getAuthHeaders();
    return this.http.get<{ status: string; rating: number | null; playtime: number; review?: string }>(
      `${this.apiUrl}/status/${gameId}`,
      { headers }
    );
  }

  // Rating
  setGameRating(gameId: number, rating: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(
      `${this.apiUrl}/rating`,
      { gameId, rating },
      { headers }
    );
  }

  // Playtime
  setGamePlaytime(gameId: number, playtime: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(
      `${this.apiUrl}/playtime`,
      { gameId, playtime },
      { headers }
    );
  }

  // Review
  setGameReview(
    gameId: number,
    review: string,
    name?: string,
    backgroundImage?: string,
    released?: string,
    rating?: number
  ): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.http.post<any>(
      `${this.apiUrl}/review`,
      {
        gameId,
        review,
        name,
        backgroundImage,
        released,
        rating
      },
      { headers }
    ).pipe(
      tap(newReview => {
        console.log('Review creada, emitiendo evento:', newReview);
        this.reviewAddedSubject.next(newReview);
      })
    );
  }

  // Recoger Reviews por usuario y juego (público)
  getGameReviews(gameId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${gameId}/reviews`);
  }

  // 🔐 Reviews del usuario autenticado (para perfil propio)
  getMyReviews(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(
      `${this.apiUrl}/user-reviews`,
      { headers }
    );
  }

  // 🌍 Reviews de un usuario específico (para perfiles públicos)
  getReviewsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/user/${userId}/reviews`
    );
  }

  // Colección pública de un usuario
  getUserGamesByStatus(userId: number, status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}/status/${status}`);
  }
}