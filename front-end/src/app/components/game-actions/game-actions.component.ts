import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { WishlistService } from '../../services/wishlist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-actions.component.html',
  styleUrl: './game-actions.component.css'
})
export class GameActionsComponent {

  @Input() game!: any;
  @Input() isBookmarked = false;

  @Output() bookmarkToggled = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

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
}
