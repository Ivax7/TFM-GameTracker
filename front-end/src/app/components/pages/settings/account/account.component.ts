import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit{
  userName = '';
  isModalOpen = false;
  isDeleteModalOpen = false;
  
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUserName();
  }

  // Recuperamos el username del backend
  loadUserName() {
    this.userService.getProfile().subscribe({
      next: (user) => {
        console.log('Profile from backend:', user);
        this.userName = user.username;
      },
      error: (err) => console.error(err)
    });
  }

  // username MODAL
  openModal() { this.isModalOpen = true; }
  closeModal() { this.isModalOpen = false; }

  // Actualizamos el Username
  submitUsername() {
    this.userService.updateUsernameProfile(this.userName).subscribe({
      next: () => {
        alert('Username updated successfully');
        this.closeModal();
      },
      error: (err) => console.log('Error updating usename', err)
    })
  }


  // delete account MODAL
  openDeleteModal() { this.isDeleteModalOpen = true; }
  closeDeleteModal() { this.isDeleteModalOpen = false; }

  confirmDeleteAccount() {
  if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    return;
  }

  this.userService.deleteAccount().subscribe({
    next: () => {
      this.closeDeleteModal();
      // redirigir
      window.location.href = '/login';
    },
    error: (err) => console.error('Error deleting account', err)
  });
}



}
