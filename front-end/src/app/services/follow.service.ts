import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Follow } from '../models/follow.model';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FollowService {
  
  // private apiUrl = 'http://localhost:3000/follow';
  private apiUrl = `${environment.apiUrl}/follow`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`
      })
    };
  }

  followUser(targetUserId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${targetUserId}`,
      {}, // body vacío
      this.getAuthHeaders()
    );
  }
  
  unfollowUser(targetUserId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${targetUserId}`,
      this.getAuthHeaders()
    );
  }


  isFollowing(targetUserId: number): Observable<{ following: boolean }> {
    return this.http.get<{ following: boolean }>(
      `${this.apiUrl}/is-following/${targetUserId}`,
      this.getAuthHeaders()
    );
  }

getFollowers(userId: number): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.apiUrl}/followers/${userId}`,
    this.getAuthHeaders()
  );
}

getFollowing(userId: number): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.apiUrl}/following/${userId}`,
    this.getAuthHeaders()
  );
}


}
