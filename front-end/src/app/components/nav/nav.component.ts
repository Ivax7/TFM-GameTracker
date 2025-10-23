import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthModalComponent } from '../../auth/auth-modal/auth-modal.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, FormsModule, AuthModalComponent],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  query = '';
  showAuthModal = false;
  currentUser: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log(this.currentUser)
    });
  }

  searchGames() {
    if (!this.query.trim()) return;
    this.router.navigate(['/search', this.query]);
  }

  toggleAuthModal() {
    this.showAuthModal = !this.showAuthModal;
  }

  logout() {
    this.authService.logout();
  }
}
