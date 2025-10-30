import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface WishlistItem {
  id: number;
  gameId: number;
  gameName: string;
  backgroundImage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = 'http://localhost:3000/wishlist';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token || ''}` });
  }

  getWishlist(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addToWishlist(game: { gameId: number; gameName: string; backgroundImage?: string }): Observable<WishlistItem> {
    return this.http.post<WishlistItem>(`${this.apiUrl}/${game.gameId}`, game, { headers: this.getHeaders() });
  }

  removeFromWishlist(gameId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${gameId}`, { headers: this.getHeaders() });
  }

  // Opcional: crear endpoint backend para check
  isInWishlist(gameId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check/${gameId}`, { headers: this.getHeaders() });
  }
}
