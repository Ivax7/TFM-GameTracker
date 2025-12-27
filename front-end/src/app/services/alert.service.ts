import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AlertAction, AlertPayload } from '../components/shared/alert-modal/alert.types';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private alertSubject = new BehaviorSubject<AlertPayload | null>(null);
  alert$ = this.alertSubject.asObservable();

  private messages: Record<AlertAction, AlertPayload> = {
    GAME_STATUS_SET: {
      type: 'success',
      message: 'Game status updated successfully 🎮'
    },
    REVIEW_PUBLISHED: {
      type: 'success',
      message: 'Review published successfully ✍️'
    },
    GAME_ADDED_TO_WISHLIST: {
      type: 'success',
      message: 'Game added to your wishlist ⭐'
    },
    GAME_REMOVED_FROM_WISHLIST: {
      type: 'error',
      message: 'Game removed from your wishlist ⭐'
    },
    GAME_ADDED_TO_LIST: {
      type: 'success',
      message: 'Game added to your custom list 📖'
    },
    GAME_REMOVED_FROM_LIST: {
      type: 'error',
      message: 'Game removed from custom list 📖'
    },
    PROFILE_UPDATED_SUCCESSFULLY: {
      type: 'success',
      message: 'Profile updated successfully ✅'
    },
    USERNAME_UPDATED_SUCCESSFULLY: {
      type: 'success',
      message: 'Username updated successfully ✅👤'
    },
    EMAIL_UPDATED_SUCCESSFULLY: {
      type: 'success',
      message: 'Email updated successfully ✅✉'
    },
    USER_FOLLOWED: {
      type: 'success',
      message: 'You are now following this user ✅'
    },
    USER_UNFOLLOWED: {
      type: 'error',
      message: 'You unfollowed this user ❌'
    },
    CUSTOM_LIST_CREATED: {
      type: 'success',
      message: 'Custom list created ✅'
    },
    CUSTOM_LIST_EDITED: {
      type: 'info',
      message: 'Custom list edited ✏️'
    },
    CUSTOM_LIST_DELETED: {
      type: 'error',
      message: 'Custom list deleted 🗑️'
    }
  };

  show(action: AlertAction) {
    this.alertSubject.next(this.messages[action]);
  }

  close() {
    this.alertSubject.next(null);
  }
}
