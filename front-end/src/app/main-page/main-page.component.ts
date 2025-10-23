import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthModalComponent } from '../auth/auth-modal/auth-modal.component';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [AuthModalComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('900ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('400ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class MainPageComponent {
  showAuthModal = false;

  constructor(private router: Router) {}

  toggleAuthModal() {
    this.showAuthModal = !this.showAuthModal;
  }

  startTracking() {
    this.router.navigate(['/trending']);
  }
}
