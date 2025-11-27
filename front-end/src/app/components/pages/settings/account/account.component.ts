import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../auth/auth.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  userName = '';
  isModalOpen = false;
  isDeleteModalOpen = false;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (!user) return;
      this.userName = user.username;
    });
  }

  openModal() { this.isModalOpen = true; }
  closeModal() { this.isModalOpen = false; }

  submitUsername() {
    this.userService.updateUsernameProfile(this.userName).subscribe({
      next: updatedUser => {
        this.authService.updateCurrentUser({ username: updatedUser.username });
        this.closeModal();
        alert('Username updated successfully');
      },
      error: err => console.error('Error updating username', err)
    });
  }

  openDeleteModal() { this.isDeleteModalOpen = true; }
  closeDeleteModal() { this.isDeleteModalOpen = false; }

  confirmDeleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;

    this.userService.deleteAccount().subscribe({
      next: () => window.location.href = '/login',
      error: err => console.error('Error deleting account', err)
    });
  }
}
