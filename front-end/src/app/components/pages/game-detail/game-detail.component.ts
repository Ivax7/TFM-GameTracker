// En game-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RawgService } from '../../../services/rawg.service';
import { GameActionsComponent } from '../../game-actions/game-actions.component';
import { CommonModule } from '@angular/common';
import { ModalManagerService } from '../../../services/modal-manager.service';
import { UserGameService } from '../../../services/user-game.service';
import { AuthService } from '../../../services/auth.service';
import { map, combineLatest } from 'rxjs';

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
  
  // Placeholder para imagen de perfil
  placeholderImage = 'assets/images/icons/profile.svg';

  constructor(
    private route: ActivatedRoute,
    private rawgService: RawgService,
    private userGameService: UserGameService,
    public modalManager: ModalManagerService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    const gameId$ = this.route.paramMap.pipe(
      map(params => Number(params.get('id')))
    );

    combineLatest([gameId$, this.authService.token$]).subscribe(
      ([gameId, _token]) => {
        this.gameId = gameId;
        this.loadGame();
        this.loadReviews();
      }
    );

    this.modalManager.reviewAdded$.subscribe((newReview: any) => {
      if (!newReview) return;
      const processedReview = this.handleReviewImage(newReview);
      this.reviews.unshift(processedReview);
      this.limitedReviews = this.reviews.slice(0, 4);
    });
  }

  // --------------------
  // UTILIDAD PARA IMÁGENES DE PERFIL EN REVIEWS
  // --------------------
  private handleReviewImage(review: any) {
    return {
      ...review,
      profileImage: review.profileImage || this.placeholderImage,
      displayName: review.displayName || review.username
    };
  }

  loadGame() {
    this.rawgService.getGameById(this.gameId).subscribe({
      next: (data: any) => {
        this.game = data;
        this.loading = false;
      },
      error: (err) => {
        console.log('Error cargando el juego:', err);
        this.loading = false;
      }
    });
  }

  loadReviews() {
    this.userGameService.getGameReviews(this.gameId).subscribe({
      next: (reviews) => {
        this.reviews = reviews.map(review => this.handleReviewImage(review));
        this.limitedReviews = this.reviews.slice(0, 4);
      },
      error: (err) => console.error('Error cargando reviews:', err)
    });
  }

  submitReview(data: { review: string, game: any }) {
    const { review, game } = data;

    if (!game || !game.name) {
      console.log("No game loaded yet");
      return;
    }

    this.userGameService.setGameReview(
      game.id,
      review,
      game.name,
      game.background_image,
      game.released,
      game.rating
    ).subscribe({
      next: (newReview) => {
        // Procesa la nueva review para asegurar la imagen de perfil
        const processedReview = this.handleReviewImage(newReview);
        this.reviews.unshift(processedReview);
        this.limitedReviews = this.reviews.slice(0, 4);
      },
      error: (err) => {
        console.error(err);
        alert('Error submitting review');
      }
    });
  }
}