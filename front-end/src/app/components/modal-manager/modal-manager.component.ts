import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalManagerService } from '../../services/modal-manager.service';
import { GameStatusModalComponent } from '../game-status-modal/game-status-modal.component';
import { UserGameService } from '../../services/user-game.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-modal-manager',
  standalone: true,
  imports: [CommonModule, GameStatusModalComponent],
  templateUrl: './modal-manager.component.html',
  styleUrls: ['./modal-manager.component.css']
})
export class ModalManagerController implements OnInit {

  showStatus = false;
  currentGame: any = null;

  constructor(
    private modalManager: ModalManagerService,
    private userGameService: UserGameService
  ) {}


  // Actualizamos el estado
  ngOnInit() {
    this.modalManager.statusModal$.subscribe(async state => {
      if (!state.game) return;

      // Traemos el estado del juego desde el backend
      try {
        const userGame = await firstValueFrom(this.userGameService.getGameStatus(state.game.id));
        this.currentGame = {
          ...state.game,
          status: userGame.status || null,
          rating: userGame.rating ?? 0
        };
      } catch {
        // Si no hay estado guardado, asignamos null
        this.currentGame = {
          ...state.game,
          status: null,
          rating: 0
        };
      }

      // Mostrar modal
      this.showStatus = state.show;
    });
  }

  onSelectStatus(status: string) {
    if (!this.currentGame) return;

    this.userGameService.setGameStatus(
      this.currentGame.id,
      status,
      this.currentGame.name,
      this.currentGame.background_image
    ).subscribe((updated) => {
      console.log('Status actualizado:', status);
      this.currentGame.status = updated.status;
    });
  }
}
