import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RawgService } from '../../../services/rawg.service';
import { GameActionsComponent } from '../../game-actions/game-actions.component';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../../services/wishlist.service';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule, GameActionsComponent],
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css']
})
export class GameDetailComponent implements OnInit {

  gameId!: number;
  game: any;
  isBookmarked = false;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private rawgService: RawgService,
    private wishlistService: WishlistService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.gameId = Number(params.get('id'));
      this.loadGame();
    });
  }

  loadGame() {
    this.rawgService.getGameById(this.gameId).subscribe({
      next: (data: any) => {
        this.game = data;
        this.loading = false;

        this.checkIfBookmarked();
      },
      error: (err) => {
        console.error('Error cargando el juego:', err);
        this.loading = false;
      }
    });
  }

  checkIfBookmarked() {
    this.wishlistService.getWishlist().subscribe({
      next: (wishlist) => {
        const safeWishlist = Array.isArray(wishlist) ? wishlist : [];
        this.isBookmarked = safeWishlist.some((g: any) => g.gameId === this.game.id);
      },
      error: (err) => console.error('Error al comprobar wishlist:', err)
    });
  }
  
  onBookmarkToggled(isBookmarked: boolean) {
    this.isBookmarked = isBookmarked;
  }

}
