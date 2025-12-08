import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalManagerService } from '../../services/modal-manager.service';
import { GameStatusModalComponent } from '../game-status-modal/game-status-modal.component';
import { RatingModalComponent } from '../rating-modal/rating-modal.component';
import { UserGameService } from '../../services/user-game.service';
import { firstValueFrom } from 'rxjs';
import { PlaytimeModalComponent } from "../playtime-modal/playtime-modal.component";
import { ReviewModalComponent } from '../review-modal/review-modal.component';

@Component({
  selector: 'app-modal-manager',
  standalone: true,
  imports: [
    CommonModule,
    GameStatusModalComponent,
    RatingModalComponent,
    PlaytimeModalComponent,
    ReviewModalComponent
  ],
  templateUrl: './modal-manager.component.html',
  styleUrls: ['./modal-manager.component.css']
})
export class ModalManagerController implements OnInit {

  showStatus = false;
  showRatingModal = false;
  showPlaytimeModal = false;
  showReviewModal = false;

  currentGame: any = null;

  constructor(
    private modalManager: ModalManagerService,
    private userGameService: UserGameService,
  ) {}

  ngOnInit() {
    // ---------------- STATUS ----------------
    this.modalManager.statusModal$.subscribe(async (state) => {
      if (!state.game) return;

      try {
        const userGame = await firstValueFrom(
          this.userGameService.getGameStatus(state.game.id)
        );

        this.currentGame = {
          ...state.game,
          status: userGame.status ?? null,
          rating: userGame.rating ?? 0,
          playtime: userGame.playtime ?? 0,
          review: userGame.review ?? ""
        };
      } catch {
        this.currentGame = {
          ...state.game,
          status: null,
          rating: 0,
          playtime: 0,
          review: ""
        };
      }

      this.showStatus = state.show;
    });

    // ---------------- RATING ----------------
    this.modalManager.ratingModal$.subscribe(state => {
      if (!state.game) return;
      this.currentGame = state.game;
      this.showRatingModal = state.show;
    });

    // ---------------- PLAYTIME ----------------
    this.modalManager.playtimeModal$.subscribe(state => {
      if (!state.game) return;
      this.currentGame = state.game;
      this.showPlaytimeModal = state.show;
    });

    // ---------------- REVIEW ----------------
    this.modalManager.reviewModal$.subscribe(state => {
      if (!state.game) return;
      this.currentGame = state.game;
      this.showReviewModal = state.show;
    });
  }

  // ---------- STATUS ----------
  onSelectStatus(status: string | null) {
    if (!this.currentGame) return;

    if (status === null) {
      this.currentGame.status = null;
      return;
    }

    this.userGameService.setGameStatus(
      this.currentGame.id,
      status,
      this.currentGame.name,
      this.currentGame.background_image
    ).subscribe((updated) => {
      this.currentGame.status = updated.status;
      this.showStatus = false;
      this.showRatingModal = true;
    });
  }

  // ---------- RATING ----------
  onSaveRating(rating: number) {
    if (!this.currentGame) return;

    this.userGameService.setGameRating(this.currentGame.id, rating)
      .subscribe(updated => {
        this.currentGame.rating = updated.rating;
        this.showRatingModal = false;
        this.showPlaytimeModal = true;
      });
  }

  // ---------- PLAYTIME ----------
  onSetPlaytime(playtime: number) {
    if (!this.currentGame) return;

    this.userGameService.setGamePlaytime(this.currentGame.id, playtime)
      .subscribe(updated => {
        this.currentGame.playtime = updated.playtime;
        this.showPlaytimeModal = false;
      });
  }

  // ---------- REVIEW ----------
  onSaveReview(review: string) {
    if (!this.currentGame) return;

    this.userGameService.setGameReview(
      this.currentGame.id,
      review,
      this.currentGame.name,
      this.currentGame.background_image,
      this.currentGame.released,
      this.currentGame.rating
    ).subscribe({
      next: (updatedReview) => {
        this.currentGame.review = updatedReview.review;
        this.showReviewModal = false;
        alert('Review added successfully!');

        this.modalManager.notifyReviewAdded(updatedReview);
      },
      error: (err) => {
        console.log(err)
        if (err.status === 400 && err.error?.message) {
          alert(err.error.message);
        } else {
          alert('Error al guardar la review.');

        }
      }
    });
  }
}
