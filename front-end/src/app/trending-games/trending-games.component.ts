import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RawgService } from '../services/rawg.service';
import { Router } from '@angular/router';

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

  constructor(
    private rawgService: RawgService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rawgService.getTrendingGames().subscribe({
      next: (res) => {
        this.trendingGames = res.results;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  seeGameDetail(gameId: number) {
    this.router.navigate(['/detail', gameId])
  }
}
