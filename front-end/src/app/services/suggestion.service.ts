import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Suggestion } from '../models/suggestion.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {
  private apiUrl = 'http://localhost:3000/suggestions';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getSuggestions(): Observable<Suggestion[]> {
    return this.http.get<Suggestion[]>(this.apiUrl);
  }

  createSuggestion(suggestion: Suggestion): Observable<Suggestion> {
    const token = this.auth.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    return this.http.post<Suggestion>(this.apiUrl, suggestion, { headers });
  }
}
