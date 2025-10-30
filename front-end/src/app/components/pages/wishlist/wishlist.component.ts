import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../../services/wishlist.service';
import { GameCardComponent } from '../../game-card/game-card.component';
import { AuthService } from '../../../services/auth.service';

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
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.userName = user.username;
    this.loadWishlist();
  }

  loadWishlist() {
    this.loading = true;
    this.wishlistService.getWishlist().subscribe({
      next: (data) => {
        this.wishlist = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar la wishlist';
        this.loading = false;
      }
    });
  }

  removeFromWishlist(game: any) {
    this.wishlistService.removeFromWishlist(game.gameId).subscribe({
      next: () => {
        this.wishlist = this.wishlist.filter(g => g.gameId !== game.gameId);
      },
      error: (err) => console.error(err)
    });
  }
}
