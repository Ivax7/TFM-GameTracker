import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalManagerService } from '../../services/modal-manager.service';
import { GameStatusModalComponent } from '../game-status-modal/game-status-modal.component';
import { UserGameService } from '../../services/user-game.service';

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

  ngOnInit() {
    this.modalManager.statusModal$.subscribe(state => {
      this.showStatus = state.show;
      this.currentGame = state.game;
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
