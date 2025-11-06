import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGameService } from '../../../services/user-game.service';

@Component({
  selector: 'app-collection-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collection-status.component.html',
  styleUrls: ['./collection-status.component.css']
})
export class CollectionStatusComponent implements OnInit {
  statuses = ['Playing', 'Played', 'Completed', 'Abandoned'];
  gamesByStatus: Record<string, any[]> = {};

  constructor(private userGameService: UserGameService) {}

  ngOnInit() {
    this.loadGames();
  }

loadGames() {
  for (const status of this.statuses) {
    this.userGameService.getGamesByStatus(status).subscribe({
      next: (games) => {
        console.log(`✅ Data received for status "${status}":`, games);
        // Aplanamos para que el HTML sea más limpio:
        this.gamesByStatus[status] = games.map((g: any) => ({
          id: g.game?.id,
          name: g.game?.name,
          backgroundImage: g.game?.backgroundImage,
          status: g.status,
        }));
      },
      error: (err) => console.error(`❌ Error loading ${status} games:`, err),
    });
  }
}


}
