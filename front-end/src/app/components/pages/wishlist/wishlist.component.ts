import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../../services/wishlist.service';
@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist: any[] = [];
  loading = true;
  error = '';

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
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

  removeFromWishlist(gameId: number) {
    this.wishlistService.removeFromWishlist(gameId).subscribe({
      next: () => {
        this.wishlist = this.wishlist.filter(game => game.gameId !== gameId);
      },
      error: (err) => console.error(err)
    });
  }
}
