import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../../services/wishlist.service';
import { GameCardComponent } from '../../game-card/game-card.component';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, GameCardComponent],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist: any[] = [];
  loading = true;
  error = '';
  userName = '';

  constructor(
    private wishlistService: WishlistService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const userId = params.get('userId');

    if (userId) {
      this.loadPublicWishlist(Number(userId));
    } else {
      this.authService.currentUser$.subscribe(currentUser => {
        this.userName = currentUser?.username || 'Usuario';
        this.loadPrivateWishlist();
      });
    }
  });
}

  loadPrivateWishlist() {
    this.loading = true;
    this.wishlistService.getWishlist().subscribe({
      next: data => { this.wishlist = data; this.loading = false; this.userName = 'My'; },
      error: () => { this.error = 'Error loading wishlist'; this.loading = false; }
    });
  }

  loadPublicWishlist(userId: number) {
    this.loading = true;
    this.wishlistService.getWishlistByUser(userId).subscribe({
      next: data => { this.wishlist = data; this.userName = 'User'; this.loading = false; },
      error: () => { this.error = 'Error loading public wishlist'; this.loading = false; }
    });
  }

  removeFromWishlist(game: any) {
    this.wishlistService.removeFromWishlist(game.gameId).subscribe({
      next: () => { this.wishlist = this.wishlist.filter(g => g.gameId !== game.gameId); },
      error: (err) => console.error(err)
    });
  }

  seeGameDetail(gameId: number) {
    this.router.navigate(['/detail', gameId]);
  }

  trackByGameId(index: number, game: any) {
    return game.gameId;
  }



}
