import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { FollowService } from '../../../services/follow.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: any = {};
  loading = true;

  followers: any[] = [];
  following: any[] = [];
  loadingFollowers = false;
  loadingFollowing = false;

  showFollowersModal = false;
  showFollowingModal = false;

  constructor(
    private userService: UserService,
    private followService: FollowService
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.userService.getProfile().subscribe({
      next: user => {
        this.profile = user;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openFollowers() {
    this.loadingFollowers = true;
    this.showFollowersModal = true;
    this.followService.getFollowers(this.profile.id).subscribe({
      next: list => {
        this.followers = list;
        this.loadingFollowers = false;
      },
      error: () => this.loadingFollowers = false
    });
  }

  openFollowing() {
    this.loadingFollowing = true;
    this.showFollowingModal = true;
    this.followService.getFollowing(this.profile.id).subscribe({
      next: list => {
        this.following = list;
        this.loadingFollowing = false;
      },
      error: () => this.loadingFollowing = false
    });
  }

  closeModal() {
    this.showFollowersModal = false;
    this.showFollowingModal = false;
  }
}
