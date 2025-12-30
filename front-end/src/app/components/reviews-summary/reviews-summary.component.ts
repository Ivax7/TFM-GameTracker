import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGameService } from '../../services/user-game.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reviews-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews-summary.component.html',
  styleUrls: ['./reviews-summary.component.css']
})
export class ReviewsSummaryComponent implements OnInit {
  @Input() userId!: number;
  reviews: any[] = [];
  loading = true;
  private reviewSubscription?: Subscription;

  constructor(
    private userGameService: UserGameService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadReviews();
    
    this.reviewSubscription = this.userGameService.reviewAdded$.subscribe(
      (newReview) => {
        console.log('Nueva review detectada:', newReview);
        
        // Solo actualizar si la review es del usuario actual
        if (newReview && newReview.userId === this.userId) {
          console.log('Recargando reviews para usuario:', this.userId);
          this.loadReviews();
        }
      }
    );
  }

  loadReviews() {
    if (!this.userId) {
      console.log('No se ha proporcionado userId para cargar las reviews.');
      this.loading = false;
      return;
    }

    this.userGameService.getUserReviewsByUser(this.userId).subscribe({
      next: (data) => {
        // Ordenar por fecha más reciente primero
        this.reviews = data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        console.log('Reviews cargadas:', this.reviews.length);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar reviews:', err);
        this.loading = false;
      }
    });
  }

  seeGameDetail(gameId: number) {
    this.router.navigate(['/detail', gameId]);
  }

}

