// src/app/game-card/game-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../auth/auth.service';
import { GameActionsComponent } from "../game-actions/game-actions.component";

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule, GameActionsComponent],
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.css']
})
export class GameCardComponent {
  @Input() game!: any;
  @Input() initialBookmarked = false;

  @Output() cardClicked = new EventEmitter<number>();
  @Output() bookmarkToggled = new EventEmitter<boolean>();


  isBookmarked = false;

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    this.isBookmarked = this.initialBookmarked;
  }

  onCardClick() {
    this.cardClicked.emit(this.game.id);
  }

  onBookmarkChange(newState: boolean) {
    this.isBookmarked = newState;
    this.bookmarkToggled.emit(newState);
  }


}
