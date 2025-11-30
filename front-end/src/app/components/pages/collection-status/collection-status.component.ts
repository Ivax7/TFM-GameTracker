import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGameService } from '../../../services/user-game.service';
import { GameCardComponent } from '../../game-card/game-card.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-collection-status',
  standalone: true,
  imports: [CommonModule, GameCardComponent],
  templateUrl: './collection-status.component.html',
  styleUrls: ['./collection-status.component.css']
})
export class CollectionStatusComponent implements OnInit {
  
  userName = '';

  statuses = [
    { key: 'Playing', label: 'Playing' },
    { key: 'Played', label: 'Played' },
    { key: 'Completed', label: 'Completed 100%' },
    { key: 'Abandoned', label: 'Abandoned' },
  ];

  @Input() game!: any;
  gamesByStatus: Record<string, any[]> = {};

  // Pestañas
  selectedTab: string = 'Playing';

  constructor(
    private userGameService: UserGameService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtenemos el user
    this.authService.currentUser$.subscribe(currentUser => {
      this.userName = currentUser?.username || 'Usuario';
    });
    
    this.loadGames();
  }

  loadGames() {
    for (const status of this.statuses) {
      this.userGameService.getGamesByStatus(status.key).subscribe({
        next: (games) => {
          console.log(`✅ Data received for status "${status}":`, games);
          this.gamesByStatus[status.key] = games.map((g: any) => ({
            id: g.game?.id,
            name: g.game?.name,
            background_image: g.game?.backgroundImage,
            status: g.status,
          }));
        },
        error: (err) => console.error(`Error loading ${status} games:`, err),
      });
    }
  }
  
  selectTab(statusKey: string) {
    this.selectedTab = statusKey;
  }

  seeGameDetail(gameId: number) {
    this.router.navigate(['/detail', gameId]);
  }

}
