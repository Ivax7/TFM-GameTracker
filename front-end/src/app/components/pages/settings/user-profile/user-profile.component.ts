import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  displayName = '';
  bio = '';
  loading = true;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.displayName = user.displayName;
        this.bio = user.bio;
        this.loading = false;
      },
      error: (err) => {
        console.log('Error fetching profile:', err);
        this.loading = false;
      }
    });
  }

  saveProfile() {
    this.userService.updateProfile(this.displayName, this.bio).subscribe({
      next: () => {
        alert('Profile updated successfully');
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        alert('There was a problem saving your profile. Please try again.');
      }
    });
  }
}
