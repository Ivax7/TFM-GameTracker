import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RawgService } from '../../../services/rawg.service';
import { WishlistService } from '../../../services/wishlist.service';
import { Router } from '@angular/router';
import { GameCardComponent } from '../../game-card/game-card.component';

@Component({
  selector: 'app-trending-games',
  standalone: true,
  imports: [CommonModule, GameCardComponent],
  templateUrl: './trending-games.component.html',
  styleUrls: ['./trending-games.component.css']
})
export class TrendingGamesComponent implements OnInit {
  trendingGames: any[] = [];
  wishlist: any[] = [];
  loading = true;

  constructor(
    private rawgService: RawgService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    Promise.all([
      this.rawgService.getTrendingGames().toPromise(),
      this.wishlistService.getWishlist().toPromise()
    ])
    .then(([trending, wishlist]) => {
      const wishlistSafe = Array.isArray(wishlist) ? wishlist : [];
      const wishlistIds = wishlistSafe.map((g: any) => g.gameId);

      this.trendingGames = trending.results.map((game: any) => ({
        ...game,
        isBookmarked: wishlistIds.includes(game.id)
      }));

      this.loading = false;
    })
    .catch(err => {
      console.error(err);
      this.loading = false;
    });
  }

  seeGameDetail(gameId: number) {
    this.router.navigate(['/detail', gameId]);
  }
}
