export type AlertType = 'success' | 'error' | 'info';

export type AlertAction =
  | 'GAME_STATUS_SET'
  | 'REVIEW_PUBLISHED'
  | 'GAME_ADDED_TO_WISHLIST'
  | 'GAME_REMOVED_FROM_WISHLIST'
  | 'GAME_ADDED_TO_LIST'
  | 'GAME_REMOVED_FROM_LIST'
  | 'PROFILE_UPDATED_SUCCESSFULLY'
  | 'USERNAME_UPDATED_SUCCESSFULLY'
  | 'EMAIL_UPDATED_SUCCESSFULLY'
  | 'USER_FOLLOWED'
  | 'USER_UNFOLLOWED'
  | 'CUSTOM_LIST_CREATED'
  | 'CUSTOM_LIST_EDITED'
  | 'CUSTOM_LIST_DELETED'
  ;

export interface AlertPayload {
  type: AlertType;
  message: string;
}
