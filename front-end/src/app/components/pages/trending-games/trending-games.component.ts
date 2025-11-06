import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RawgService } from '../../../services/rawg.service';
import { WishlistService } from '../../../services/wishlist.service';
import { Router } from '@angular/router';
import { GameCardComponent } from '../../game-card/game-card.component';
import { firstValueFrom } from 'rxjs';
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
  firstValueFrom(this.rawgService.getTrendingGames())
    .then(trending => {
      this.trendingGames = trending.results;
    })
    .catch(err => console.error('Error cargando trending:', err))
    .finally(() => this.loading = false);

  this.wishlistService.getWishlist().subscribe({
    next: wishlist => console.log('Wishlist:', wishlist),
    error: err => console.warn('No se pudo cargar wishlist:', err)
  });
}


  seeGameDetail(gameId: number) {
    this.router.navigate(['/detail', gameId]);
  }
}
