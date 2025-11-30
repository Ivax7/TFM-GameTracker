import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ModalState {
  show: boolean;
  game: any;
}

@Injectable({
  providedIn: 'root'
})
export class ModalManagerService {

  // Estado de cada modal
  private statusModalState = new BehaviorSubject<ModalState>({ show: false, game: null });
  private ratingModalState = new BehaviorSubject<ModalState>({ show: false, game: null });
  private playtimeModalState = new BehaviorSubject<ModalState>({ show: false, game: null });
  private reviewModalState = new BehaviorSubject<ModalState>({ show: false, game: null });
  private reviewAddedSource = new BehaviorSubject<any | null>(null);

  statusModal$ = this.statusModalState.asObservable();
  ratingModal$ = this.ratingModalState.asObservable();
  playtimeModal$ = this.playtimeModalState.asObservable();
  reviewModal$ = this.reviewModalState.asObservable();
  reviewAdded$ = this.reviewAddedSource.asObservable();

  // ------------------ STATUS ------------------
  openStatusModal(game: any) {
    this.statusModalState.next({ show: true, game });
  }

  closeStatusModal() {
    this.statusModalState.next({ show: false, game: null });
  }

  // ------------------ RATING ------------------
  openRatingModal(game: any) {
    this.ratingModalState.next({ show: true, game });
  }

  closeRatingModal() {
    this.ratingModalState.next({ show: false, game: null });
  }

  // ------------------ PLAYTIME ------------------
  openPlaytimeModal(game: any) {
    this.playtimeModalState.next({ show: true, game });
  }

  closePlaytimeModal() {
    this.playtimeModalState.next({ show: false, game: null });
  }

  // ------------------ REVIEW ------------------
  openReviewModal(game: any) {
    this.reviewModalState.next({ show: true, game });
  }

  closeReviewModal() {
    this.reviewModalState.next({ show: false, game: null });
  }

  notifyReviewAdded(review: any) {
    this.reviewAddedSource.next(review);
  }
}
