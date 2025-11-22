import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalManagerService } from '../../services/modal-manager.service';
import { GameStatusModalComponent } from '../game-status-modal/game-status-modal.component';
import { RatingModalComponent } from '../rating-modal/rating-modal.component';
import { UserGameService } from '../../services/user-game.service';
import { firstValueFrom } from 'rxjs';
import { PlaytimeModalComponent } from "../playtime-modal/playtime-modal.component";

@Component({
  selector: 'app-modal-manager',
  standalone: true,
  imports: [CommonModule, GameStatusModalComponent, RatingModalComponent, PlaytimeModalComponent],
  templateUrl: './modal-manager.component.html',
  styleUrls: ['./modal-manager.component.css']
})
export class ModalManagerController implements OnInit {

  showStatus = false;
  showRatingModal = false;
  showPlaytimeModal = false;
  currentGame: any = null;


  constructor(
    private modalManager: ModalManagerService,
    private userGameService: UserGameService,
  ) {}


  // Actualizamos el estado
  ngOnInit() {
    this.modalManager.statusModal$.subscribe(async state => {
      if (!state.game) return;

      try {
        const userGame = await firstValueFrom(this.userGameService.getGameStatus(state.game.id));
        this.currentGame = {
          ...state.game,
          status: userGame.status || null,
          rating: userGame.rating ?? 0,
          playtime: userGame.playtime ?? 0
        };
      } catch {
        this.currentGame = {
          ...state.game,
          status: null,
          rating: 0,
          playtime: 0,
        };
      }
      this.showStatus = state.show;
    });
  }

  // Set status
  onSelectStatus(status: string | null) {
    if (!this.currentGame) return;
  
    if (status !== null) {
      this.userGameService.setGameStatus(
        this.currentGame.id,
        status, // seguro que es string
        this.currentGame.name,
        this.currentGame.background_image
      ).subscribe((updated) => {
        console.log('Status actualizado:', status);
        this.currentGame.status = updated.status;
        this.showStatus = false;
        this.showRatingModal = true;
      });
    } else {
      // Clear → solo actualizamos localmente
      this.currentGame.status = null;
    }
  }


  // Set rating
  onSaveRating(rating: number) {
    if (!this.currentGame) return;

    this.userGameService.setGameRating(this.currentGame.id, rating)
      .subscribe(updated => {
        this.currentGame.rating = updated.rating;
        this.showRatingModal = false;
        this.showPlaytimeModal = true
      });
  }
  
  // Set playtime
  onSetPlaytime(playtime: number) {
    if (!this.currentGame) return;

    this.userGameService.setGamePlaytime(this.currentGame.id, playtime)
      .subscribe(updated => {
        console.log('Playtime saved:', playtime);
        this.currentGame.duration = updated.playitme;
        this.showPlaytimeModal = false;
      });
  }
}
