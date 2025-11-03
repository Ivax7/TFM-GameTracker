import { Component, Input, Output, EventEmitter } from '@angular/core';
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
export class GameActionsComponent {

  @Input() game!: any;
  @Input() isBookmarked = false;

  @Output() bookmarkToggled = new EventEmitter<boolean>();

  showStatusModal = false;

  constructor(
    private authService: AuthService,
    private wishlistService: WishlistService,
    private userGameService: UserGameService,
    private router: Router
  ) {}

  // ADD WISHLIST
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
          backgroundImage: this.game.background_image
        });
      
        action$.subscribe({
      next: () => this.isBookmarked = !this.isBookmarked,
      error: (err) => this.handleAuthError(err)
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
    this.userGameService.setGameStatus(this.game.id, status).subscribe({
      next: () => console.log(`Game status set to ${status}`),
      error: (err) => this.handleAuthError(err)
    });
  }


}
