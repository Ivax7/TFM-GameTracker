import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ModalManagerService } from '../../services/modal-manager.service';
import { UserGameService } from '../../services/user-game.service';
import { WishlistService } from '../../services/wishlist.service';
import { RatingModalComponent } from '../rating-modal/rating-modal.component';

@Component({
  selector: 'app-game-actions',
  standalone: true,
  imports: [CommonModule, RatingModalComponent],
  templateUrl: './game-actions.component.html',
  styleUrl: './game-actions.component.css'
})
export class GameActionsComponent implements OnInit {

  @Input() game!: any;
  @Input() isBookmarked = false;

  @Output() bookmarkToggled = new EventEmitter<boolean>();

  currentStatus: string | null = null;
  currentRating: number | null = null;

  showRatingModal = false;

  constructor(
    private authService: AuthService,
    private wishlistService: WishlistService,
    private userGameService: UserGameService,
    private router: Router,
    private modalManager: ModalManagerService,
  ) {}

  ngOnInit() {
    if (this.game) {
      this.loadGameStatus();
      this.loadBookmarkStatus();
    }
  }

  private loadGameStatus() {
    this.userGameService.getGameStatus(this.game.id).subscribe({
      next: (res) => {
        this.currentStatus = res.status || null;
        this.currentRating = res.rating ?? 0;
      },
      error: () => {
        this.currentStatus = null;
        this.currentRating = 0;
      }
    });
  }

  // BOOKMARK
  toggleBookmark(event: MouseEvent) {
    event.stopPropagation();

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const action$ = this.isBookmarked
      ? this.wishlistService.removeFromWishlist(this.game.id)
      : this.wishlistService.addToWishlist({
          gameId: this.game.id,
          gameName: this.game.name,
          backgroundImage: this.game.background_image,
        });

    action$.subscribe({
      next: () => {
        this.isBookmarked = !this.isBookmarked;
        this.bookmarkToggled.emit(this.isBookmarked);
      },
      error: (err) => this.handleAuthError(err),
    });
  }

  private loadBookmarkStatus() {
    this.wishlistService.getWishlist().subscribe({
      next: (wishlist) => {
        const safe = Array.isArray(wishlist) ? wishlist : [];
        this.isBookmarked = safe.some(g => g.gameId === this.game.id);
      }
    });
  }

  // RATING
  openRatingModal(event: MouseEvent) {
    event.stopPropagation();

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.showRatingModal = true;
  }

  onSaveRating(value: number) {
    this.userGameService.setGameRating(this.game.id, value).subscribe({
      next: () => {
        this.currentRating = value;
        this.showRatingModal = false;
      },
      error: (err) => console.error('Error saving rating:', err)
    });
  }

  private handleAuthError(err: any) {
    if (err.status === 401) {
      this.authService.logout();
      this.router.navigate(['/login']);
    } else {
      console.error(err);
    }
  }


  openStatusModal(game: any, event: Event) {
    event.stopPropagation();
    this.modalManager.openStatusModal(game);
  }

}
