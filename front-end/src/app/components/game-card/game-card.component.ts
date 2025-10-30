// src/app/game-card/game-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.css']
})
export class GameCardComponent {
  @Input() game!: any;
  @Input() initialBookmarked = false;

  @Output() cardClicked = new EventEmitter<number>();

  isBookmarked = false;

  constructor(
    private wishlistService: WishlistService,
    private authService: AuthService,
    private router: Router
  ) {}

ngOnInit() {
  this.isBookmarked = this.initialBookmarked;

  if (this.authService.isLoggedIn()) {
    this.wishlistService.isInWishlist(this.game.id).subscribe({
      next: (inWishlist) => this.isBookmarked = inWishlist,
      error: (err) => console.error('Error checking wishlist:', err)
    });
  }
}


  onCardClick() {
    this.cardClicked.emit(this.game.id);
  }

  toggleBookmark(event: MouseEvent) {
    event.stopPropagation();

    if (!this.authService.isLoggedIn()) {
      alert('Por favor, inicia sesión para guardar juegos en tu wishlist');
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
