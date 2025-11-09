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

  getGameStatus(gameId: number): Observable<{ status: string; rating: number | null }> {
    const headers = this.getAuthHeaders();
      return this.http.get<{ status: string; rating: number | null }>(
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
}
