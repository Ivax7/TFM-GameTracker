import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomList } from '../models/custom-list.model';

@Injectable({ providedIn: 'root' })
export class CustomListService {

  private apiUrl = 'http://localhost:3000/custom-lists';

  constructor(private http: HttpClient) {}

  /* CRUD Custom List*/
  createList(data: { title: string; description?: string }) {
    return this.http.post<CustomList>(this.apiUrl, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }

  getMyLists() {
    return this.http.get<CustomList[]>(this.apiUrl, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }


  deleteList(listId: number) {
    return this.http.delete(`${this.apiUrl}/${listId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }


  toggleGameInList(listId: number, game: any) {
    return this.http.post(
      `${this.apiUrl}/${listId}/games/toggle`,
      game,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }

  getListById(id: string | number): Observable<CustomList> {
    return this.http.get<CustomList>(`${this.apiUrl}/${id}`, {
      headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  }




}
