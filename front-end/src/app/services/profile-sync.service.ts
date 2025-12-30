// profile-sync.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileSyncService {
  private profileUpdatedSubject = new BehaviorSubject<any>(null);
  profileUpdated$ = this.profileUpdatedSubject.asObservable();

  notifyProfileUpdate(updatedUser: any) {
    this.profileUpdatedSubject.next(updatedUser);
  }
}