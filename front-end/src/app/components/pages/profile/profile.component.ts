import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { FollowService } from '../../../services/follow.service';
import { ActivatedRoute } from '@angular/router';

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

  isFollowing = false;

  followers: any[] = [];
  following: any[] = [];

  loadingFollowers = false;
  loadingFollowing = false;

  showFollowersModal = false;
  showFollowingModal = false;

  isOwnProfile = true;
  routeUsername: string | null = null;

  constructor(
    private userService: UserService,
    private followService: FollowService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Detectar cambios en la URL dinámicamente
    this.route.paramMap.subscribe(params => {
      this.routeUsername = params.get('username');

      if (this.routeUsername) {
        // PERFIL PÚBLICO
        this.isOwnProfile = false;
        this.loadPublicProfile(this.routeUsername);
      } else {
        // PERFIL PRIVADO
        this.isOwnProfile = true;
        this.loadProfile();
      }
    });
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

  loadPublicProfile(username: string) {
    this.loading = true;
    this.userService.getUserByUsername(username).subscribe({
      next: user => {
        this.profile = {
          ...user,
          profileImage: user.profileImage || 'assets/images/icons/profile.svg'
        };

        // check if we already follow the user
        this.isFollowing = this.following.some(f => f.id === user.id);

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

  toggleFollow() {
  if (!this.isFollowing) {
    this.followService.followUser(this.profile.id).subscribe({
      next: () => {
        this.isFollowing = true;
        this.profile.followersCount++;
      },
      error: err => console.error(err)
    });
  } else {
    this.followService.unfollowUser(this.profile.id).subscribe({
      next: () => {
        this.isFollowing = false;
        this.profile.followersCount--;
      },
      error: err => console.error(err)
    });
  }
}

}
