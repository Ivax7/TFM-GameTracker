import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { FollowService } from '../../../services/follow.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

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

  // Ratings
  ratingChart: any

  constructor(
    private userService: UserService,
    private followService: FollowService,
    private route: ActivatedRoute,
    private router: Router
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
      this.profile = {
        ...user,
        id: user.id,
        profileImage: user.profileImage || 'assets/images/icons/profile.svg'
      };
      
      this.loadUserRatings(this.profile.id)

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

        this.loadUserRatings(this.profile.id)

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
  this.loadingFollowers = true;
  this.showFollowersModal = true;

  this.followService.getFollowers(this.profile.id).subscribe({
    next: list => {
      const baseUrl = 'http://localhost:3000/uploads/';
      this.followers = list.map(u => ({
        ...u,
        profileImage: u.profileImage ? baseUrl + u.profileImage : 'assets/images/icons/profile.svg'
      }));
      this.loadingFollowers = false;
    },
    error: (err) => {
      console.log(err);
      this.loadingFollowers = false;
    }
  });
}

openFollowing() {
  this.loadingFollowing = true;
  this.showFollowingModal = true;

  this.followService.getFollowing(this.profile.id).subscribe({
    next: list => {
      const baseUrl = 'http://localhost:3000/uploads/';
      this.following = list.map(u => ({
        ...u,
        profileImage: u.profileImage ? baseUrl + u.profileImage : 'assets/images/icons/profile.svg'
      }));
      this.loadingFollowing = false;
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

  goToUser(username: string) {
    this.closeModal();
    this.router.navigate(['/user', username]);
  }



  // Cargar ratings usuarios
loadUserRatings(userId: number) {
  this.userService.getUserRatings(userId).subscribe({
    next: (games: any[]) => {
      console.log('Ratings recibidos del backend:', games);

      const counts: Record<1|2|3|4|5, number> = { 1:0, 2:0, 3:0, 4:0, 5:0 };

      games.forEach(g => {
        const r = Number(g.rating) as 1|2|3|4|5;
        console.log(`Juego: ${g.game.name}, score: ${r}`);
        if (r >= 1 && r <= 5) counts[r]++;
      });

      console.log('Counts finales para el chart:', counts);

      this.renderChart(counts);
    },
    error: err => console.log('Error al cargar ratings:', err)
  });
}



  // Renderizar gráfico
  renderChart(counts: any) {
    if (this.ratingChart) this.ratingChart.destroy();

    const ctx = document.getElementById('ratingsChart') as HTMLCanvasElement;
    this.ratingChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['1 ⭐', '2 ⭐', '3 ⭐', '4 ⭐', '5 ⭐'],
        datasets: [{
          label: 'Ratings count',
          data: [
            counts[1],
            counts[2],
            counts[3],
            counts[4],
            counts[5]
          ],
          backgroundColor: [
            '#ff6b6b',
            '#ffa94d',
            '#ffd93d',
            '#6bcf63',
            '#4c9aff'
          ]
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    })
  }
}
