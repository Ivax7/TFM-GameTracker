import { Component } from '@angular/core';
import { AuthModalComponent } from '../auth/auth-modal/auth-modal.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [AuthModalComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {

  showAuthModal = false;

  toggleAuthModal() {
    this.showAuthModal = !this.showAuthModal
  }
}
