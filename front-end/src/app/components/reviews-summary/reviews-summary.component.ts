import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGameService } from '../../services/user-game.service';
import { HttpClient } from '@angular/common/http';

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

  constructor(private userGameService: UserGameService, private http: HttpClient) {}

  ngOnInit() {
  if (!this.userId) {
    console.log('No se ha proporcionado userId para cargar las reviews.');
    this.loading = false;
    return;
  }

  this.userGameService.getUserReviewsByUser(this.userId).subscribe({
    next: (data) => {
      this.reviews = data;
      console.log('Reviews cargadas:', this.reviews);
      this.loading = false;
    },
    error: (err) => {
      console.error('Error al cargar reviews:', err);
      this.loading = false;
    }
  });
}

}

