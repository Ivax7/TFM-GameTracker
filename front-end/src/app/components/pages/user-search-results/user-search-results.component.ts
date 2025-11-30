import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-search-results',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-search-results.component.html',
  styleUrls: ['./user-search-results.component.css']
})
export class UserSearchResultsComponent implements OnInit {
  query: string = '';
  users: any[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.query = params.get('query') || '';
      this.searchUsers(this.query);
    });
  }

  searchUsers(query: string) {
    this.loading = true;
    this.userService.searchUsers(query).subscribe({
      next: (res: any[]) => {
        this.users = res.map(u => ({
          ...u,
          profileImage: u.profileImage
            ? `http://localhost:3000/uploads/${u.profileImage}`
            : 'assets/images/icons/profile.svg'
        }));
        this.loading = false;
      },
      error: () => {
        this.users = [];
        this.loading = false;
      }
    });
  }

  goToProfile(userId: number) {
    this.router.navigate(['/profile', userId]);
  }
}
