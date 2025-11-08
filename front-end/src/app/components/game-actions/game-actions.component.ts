import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { WishlistService } from '../../services/wishlist.service';
import { Router } from '@angular/router';
import { GameStatusModalComponent } from '../game-status-modal/game-status-modal.component';
import { UserGameService } from '../../services/user-game.service';

@Component({
  selector: 'app-game-actions',
  standalone: true,
  imports: [CommonModule, GameStatusModalComponent],
  templateUrl: './game-actions.component.html',
  styleUrl: './game-actions.component.css'
})
export class GameActionsComponent implements OnInit {
  @Input() game!: any;
  @Input() isBookmarked = false;

  @Output() bookmarkToggled = new EventEmitter<boolean>();

  currentStatus: string | null = null;
  showStatusModal = false;
  isLoadingStatus = false;

  constructor(
    private authService: AuthService,
    private wishlistService: WishlistService,
    private userGameService: UserGameService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.game) {
      this.loadGameStatus();
      this.loadBookmarkStatus();
    }
  }

  private loadGameStatus() {
    this.isLoadingStatus = true;
    this.userGameService.getGameStatus(this.game.id).subscribe({
      next: (res) => {
        this.currentStatus = res.status || null;
        this.isLoadingStatus = false;
        console.log('📊 Status cargado desde backend:', this.currentStatus);
      },
      error: (err) => {
        console.log('Error cargando status del juego:', err);
        this.currentStatus = null;
        this.isLoadingStatus = false;
      }
    });
  }

  // STATUS
  openStatusModal(event: MouseEvent) {
    event.stopPropagation();
    if (!this.authService.isLoggedIn()) {
      alert('Please log in to update game status');
      this.router.navigate(['/login']);
      return;
    }
    this.showStatusModal = true;
  }

  onStatusSelected(status: string) {
    if (!this.game) return;

    this.userGameService
      .setGameStatus(this.game.id, status, this.game.name, this.game.background_image)
      .subscribe({
        next: () => {
          this.currentStatus = status;
          this.showStatusModal = false;
          console.log(`✅ Status actualizado a: ${status}`);
        },
        error: (err) => this.handleAuthError(err),
      });
  }

  // BOOKMARK
    toggleBookmark(event: MouseEvent) {
    event.stopPropagation();
    if (!this.authService.isLoggedIn()) {
      alert('Please, login to save games in your wishlist');
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
        console.log('🔖 Bookmark actualizado:', this.isBookmarked);
      },
      error: (err) => this.handleAuthError(err),
    });
  }

  private loadBookmarkStatus() {
    this.wishlistService.getWishlist().subscribe({
      next: (wishlist) => {
        const safeWishlist = Array.isArray(wishlist) ? wishlist : [];
        this.isBookmarked = safeWishlist.some(g => g.gameId === this.game.id);
        console.log('🔖 Bookmark cargado:', this.isBookmarked);
      },
      error: (err) => console.error('Error cargando wishlist:', err)
    });
  }

  private handleAuthError(err: any) {
    if (err.status === 401) {
      alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      this.authService.logout();
      this.router.navigate(['/login']);
    } else {
      console.error(err);
    }
  }
}
