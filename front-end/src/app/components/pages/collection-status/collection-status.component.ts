import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGameService } from '../../../services/user-game.service';
import { GameCardComponent } from '../../game-card/game-card.component';
import { Router, ActivatedRoute } from '@angular/router';
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
  visitedUserId: number | null = null;

  statuses = [
    { key: 'Playing', label: 'Playing' },
    { key: 'Played', label: 'Played' },
    { key: 'Completed', label: 'Completed 100%' },
    { key: 'Abandoned', label: 'Abandoned' },
  ];

  gamesByStatus: Record<string, any[]> = {};
  selectedTab: string = 'Playing';

  constructor(
    private userGameService: UserGameService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    // Se inicializa el diccionario vacío
    this.statuses.forEach(s => this.gamesByStatus[s.key] = []);

    // Detectar si estamos viendo un perfil ajeno
    this.route.queryParamMap.subscribe(params => {
      const userId = params.get('userId');

      if (userId) {
        // PERFIL PÚBLICO
        this.visitedUserId = Number(userId);
        this.userName = 'User'; // El username debería venir del perfil
        this.loadPublicCollection(this.visitedUserId);
      } else {
        // PERFIL PROPIO
        this.visitedUserId = null;
        this.authService.currentUser$.subscribe(currentUser => {
          this.userName = currentUser?.username || 'Usuario';
          this.loadPrivateCollection();
        });
      }
    });
  }

  // ---------------------------
  // COLECCIÓN DEL USUARIO LOGUEADO
  // ---------------------------
  loadPrivateCollection() {
    for (const status of this.statuses) {
      this.userGameService.getGamesByStatus(status.key).subscribe({
        next: (games) => {
          this.gamesByStatus[status.key] = games.map((g: any) => ({
            id: g.game?.id,
            name: g.game?.name,
            background_image: g.game?.backgroundImage,
            status: g.status,
          }));
        },
        error: (err) => console.error(`Error loading ${status.key} games:`, err),
      });
    }
  }

  // ---------------------------
  // COLECCIÓN PÚBLICA DE OTRO USUARIO
  // ---------------------------
  loadPublicCollection(userId: number) {
    for (const status of this.statuses) {
      this.userGameService.getUserGamesByStatus(userId, status.key).subscribe({
        next: (games) => {
          this.gamesByStatus[status.key] = games.map((g: any) => ({
            id: g.game?.id,
            name: g.game?.name,
            background_image: g.game?.backgroundImage,
            status: g.status,
          }));
        },
        error: (err) => console.error(`Error loading ${status.key} games:`, err),
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
