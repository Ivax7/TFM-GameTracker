import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RawgService {
  private apiUrl = 'https://api.rawg.io/api';
  private apiKey = '98cf656e3b054483a3d2edafaa6cae58';

  constructor(private http: HttpClient) {}

  getTrendingGames(): Observable<any> {
    // "TRENDING GAMES"
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);

    const from = lastMonth.toISOString().split('T')[0];
    const to = today.toISOString().split('T')[0];

    const url = `${this.apiUrl}/games?key=${this.apiKey}&dates=${from},${to}&ordering=-added&page_size=24`;
    return this.http.get(url);
  }

  // SEARCH RESULTS
  getGamesByName(query: string): Observable<any> {
    const url = `${this.apiUrl}/games?key=${this.apiKey}&search=${encodeURIComponent(query)}&page_size=20`;
    return this.http.get(url);
  }
  
  // GET DETAIL
  getGameById(id: number): Observable<any> {
    const url = `${this.apiUrl}/games/${id}?key=${this.apiKey}`;
    return this.http.get(url);
  }

}
