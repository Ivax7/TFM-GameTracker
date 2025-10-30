import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RawgService } from '../services/rawg.service';
import { Router } from '@angular/router';
import { WishlistService, WishlistItem } from '../services/wishlist.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-trending-games',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trending-games.component.html',
  styleUrls: ['./trending-games.component.css']
})
export class TrendingGamesComponent implements OnInit {
  trendingGames: any[] = [];
  loading = true;

  // Mapa para saber qué juegos están en la wishlist
  gameIsBookmarked: Record<number, boolean> = {};

  constructor(
    private rawgService: RawgService,
    private router: Router,
    private wishlistService: WishlistService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.rawgService.getTrendingGames().subscribe({
      next: (res) => {
        this.trendingGames = res.results;
        this.loading = false;

        // Comprobar cuáles juegos ya están en la wishlist
        this.trendingGames.forEach(game => this.checkBookmark(game.id));
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  seeGameDetail(gameId: number) {
    this.router.navigate(['/detail', gameId]);
  }

  // Comprobar si un juego está en la wishlist
  checkBookmark(gameId: number) {
    this.wishlistService.isInWishlist(gameId).subscribe({
      next: (is) => {
        this.gameIsBookmarked[gameId] = is;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

toggleBookmark(event: MouseEvent, game: any) {
  event.stopPropagation();

  // Verificar si el usuario está autenticado
  if (!this.authService.isLoggedIn()) {
    alert('Por favor, inicia sesión para guardar juegos en tu wishlist');
    this.router.navigate(['/login']); // Redirigir al login
    return;
  }

  if (this.gameIsBookmarked[game.id]) {
    this.wishlistService.removeFromWishlist(game.id).subscribe({
      next: () => {
        this.gameIsBookmarked[game.id] = false;
      },
      error: (err) => {
        console.error('Error removing from wishlist:', err);
        this.handleAuthError(err);
      }
    });
  } else {
    this.wishlistService.addToWishlist({
      gameId: game.id,
      gameName: game.name,
      backgroundImage: game.background_image
    }).subscribe({
      next: () => {
        this.gameIsBookmarked[game.id] = true;
      },
      error: (err) => {
        console.error('Error adding to wishlist:', err);
        this.handleAuthError(err);
      }
    });
  }
}

// Añade método para manejar errores de autenticación
private handleAuthError(error: any) {
  if (error.status === 401) {
    alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

  // Para el template
  isBookmarked(gameId: number): boolean {
    return !!this.gameIsBookmarked[gameId];
  }
}
