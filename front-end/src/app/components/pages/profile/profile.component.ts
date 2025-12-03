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
        console.log(user)
        this.profile = {
          ...user,
          profileImage: user.profileImage || 'assets/images/icons/profile.svg',
          id: user.id,
        };

        // check if we follow the user
        this.followService.isFollowing(user.id).subscribe({
          next: res => {
            this.isFollowing = res.following; // true o false desde la API
            this.loading = false;
          },
          error: () => {
            this.isFollowing = false;
            this.loading = false;
          }
        });
      },
      error: () => {
        this.loading = false;
      }
    });
  }


  openFollowers() {
  console.log(this.profile.id)

  this.loadingFollowers = true;
  this.showFollowersModal = true;

  this.followService.getFollowers(this.profile.id).subscribe({
    next: list => {
      this.followers = list;
      this.loadingFollowers = false;
      console.log('Followers:', this.followers);
    },
    error: (err) => {
      console.log(err);
      this.loadingFollowers = false;
    }
  });
}

openFollowing() {
  console.log(this.profile.id)

  this.loadingFollowing = true;
  this.showFollowingModal = true;

  this.followService.getFollowing(this.profile.id).subscribe({
    next: list => {
      this.following = list;
      this.loadingFollowing = false;
      console.log('Following:', this.following);
    },
    error: (err) => {
      console.log(err);
      this.loadingFollowing = false;
    }
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
          this.profile.followersCount = (this.profile.followersCount || 0) + 1;
        }
      });
    } else {
      this.followService.unfollowUser(this.profile.id).subscribe({
        next: () => {
          this.isFollowing = false;
          this.profile.followersCount = Math.max(0, (this.profile.followersCount || 1) - 1);
        }
      });
    }
  }


}
