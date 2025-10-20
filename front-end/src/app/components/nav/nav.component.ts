import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RawgService } from '../../services/rawg.service';
import { SearchResultsComponent } from '../search-results/search-results.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchResultsComponent],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  query = '';
  results: any[] = [];
  loading = false;

  constructor(private rawgService: RawgService) {}

  searchGames() {
    if (!this.query.trim()) {
      this.results = [];
      return;
    }

    this.loading = true;
    this.rawgService.getGamesByName(this.query).subscribe({
      next: (res) => {
        this.results = res.results;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al buscar juegos:', err);
        this.loading = false;
      }
    });
  }
}
