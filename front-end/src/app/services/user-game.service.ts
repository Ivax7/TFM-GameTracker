import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserGameService {
  private apiUrl = 'http://localhost:3000/user-games';

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

  // Rating
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
  
    return this.http.post(
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
    );
  }


  // Recoger Reviews por usuario y juego
  getGameReviews(gameId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/${gameId}/reviews`);
  }


  // Recoger todas las reviews de un usuario
  getUserReviewsByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/user-reviews/${userId}`);
  }
  

  getUserGamesByStatus(userId: number, status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}/status/${status}`);
  }

}
