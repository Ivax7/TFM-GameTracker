import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RawgService } from '../../../services/rawg.service';
import { GameActionsComponent } from '../../game-actions/game-actions.component';
import { CommonModule } from '@angular/common';
import { ModalManagerService } from '../../../services/modal-manager.service';
import { UserGameService } from '../../../services/user-game.service';
import { AuthService } from '../../../services/auth.service';

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
  reviews: any[] = [];
  limitedReviews: any[] = [];
  showAll = false;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private rawgService: RawgService,
    private userGameService: UserGameService,
    public modalManager: ModalManagerService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    // Recargar token y datos si cambia
    this.authService.token$.subscribe(() => {
      this.loadReviews();
      this.loadGame();
    });
    
    // Cargar datos según el id de la ruta
    this.route.paramMap.subscribe(params => {
      this.gameId = Number(params.get('id'));
      this.loadGame();
      this.loadReviews();
    });

    // 🔔 Suscribirse a nuevas reviews emitidas desde el modal
    this.modalManager.reviewAdded$.subscribe((newReview) => {
      if (!newReview) return;
      this.reviews.unshift(newReview);             // Agregar al inicio
      this.limitedReviews = this.reviews.slice(0,4); // Actualizar vista limitada
    });
  }

  loadGame() {
    this.rawgService.getGameById(this.gameId).subscribe({
      next: (data: any) => {
        this.game = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando el juego:', err);
        this.loading = false;
      }
    });
  }

  loadReviews() {
    this.userGameService.getGameReviews(this.gameId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.limitedReviews = reviews.slice(0, 4);
      },
      error: (err) => console.error('Error cargando reviews:', err)
    });
  }

  submitReview(reviewText: string) {
    this.userGameService.setGameReview(this.gameId, reviewText).subscribe({
      next: (newReview) => {
        this.reviews.unshift(newReview);
        this.limitedReviews = this.reviews.slice(0, 4);
        alert('Review added successfully!');
      },
      error: (err) => {
        console.error(err);
        alert('Error submitting review');
      }
    });
  }
}
