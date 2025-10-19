import { Component } from '@angular/core';
import { AuthModalComponent } from '../auth/auth-modal/auth-modal.component';
import { TrendingGamesComponent } from '../trending-games/trending-games.component';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations'


@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [AuthModalComponent, TrendingGamesComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [ // fade in
        style({ opacity: 0 }),
        animate('900ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [ // fade out
        animate('400ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class MainPageComponent {

  showAuthModal = false;
  isTrackingStarted = false;


  // Toggle Modal
  toggleAuthModal() {
    this.showAuthModal = !this.showAuthModal
  }

  // Start tracking
  startTracking() {
    this.isTrackingStarted = true;
  }


}
