import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RawgService } from '../../../services/rawg.service';
import { GameCardComponent } from '../../game-card/game-card.component'; // importa el componente de la card

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, GameCardComponent], // lo añadimos aquí
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent implements OnInit {
  results: any[] = [];
  loading = false;
  query = '';

  constructor(
    private route: ActivatedRoute,
    private rawgService: RawgService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('🟢 SearchResultsComponent inicializado');
    this.route.paramMap.subscribe((params) => {
      this.query = params.get('query') || '';
      this.searchGames();
    });
  }

  searchGames() {
    if (!this.query.trim()) return;

    this.loading = true;
    this.rawgService.getGamesByName(this.query).subscribe({
      next: (res) => {
        this.results = res.results;
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
    });
  }

  seeGameDetail(gameId: number) {
    this.router.navigate(['/detail', gameId]);
  }
}
