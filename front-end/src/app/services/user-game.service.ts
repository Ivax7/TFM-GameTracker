import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserGameService {
  private apiUrl = 'http://localhost:3000/user-games';

  constructor(private http: HttpClient) {}

  setGameStatus(gameId: number, status: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/status`, { gameId, status });
  }
}
