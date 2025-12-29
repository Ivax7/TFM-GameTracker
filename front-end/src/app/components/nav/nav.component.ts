import {
  Component,
  OnInit,
  HostListener,
  ElementRef
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthModalComponent } from '../../auth/auth-modal/auth-modal.component';
import { AuthService, CurrentUser } from '../../auth/auth.service';
import { RawgService } from '../../services/rawg.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, FormsModule, AuthModalComponent, RouterLink],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  query = '';
  searchResults: any[] = [];
  searchingUsers = false;
  showSuggestions = false;

  private searchSubject = new Subject<string>();

  showAuthModal = false;
  currentUser: CurrentUser | null = null;
  isDropdownOpen = false;

  readonly fallbackAvatar = 'assets/images/icons/profile.svg';

  constructor(
    private router: Router,
    private auth: AuthService,
    private rawgService: RawgService,
    private userService: UserService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    // 🔥 fuente única de verdad
    this.auth.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.searchSubject.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(query => {
        const trimmed = query.trim();

        if (!trimmed) return of([]);

        if (trimmed.startsWith('@')) {
          this.searchingUsers = true;
          return this.userService.searchUsers(trimmed.slice(1));
        } else {
          this.searchingUsers = false;
          return this.rawgService.getGamesByName(trimmed);
        }
      })
    ).subscribe(res => {
      this.searchResults = this.searchingUsers
        ? res.slice(0, 5)
        : res.results?.slice(0, 5) || [];

      this.showSuggestions = true;
    });
  }

  onSearchChange() {
    this.searchSubject.next(this.query);
  }

  search() {
    const trimmed = this.query.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('@')) {
      this.router.navigate(['/users/search', trimmed.slice(1)]);
    } else {
      this.router.navigate(['/search', trimmed]);
    }

    this.resetSearch();
  }

  selectItem(item: any) {
    this.router.navigate(
      this.searchingUsers
        ? ['/user', item.username]
        : ['/detail', item.id]
    );
    this.resetSearch();
  }

  resetSearch() {
    this.query = '';
    this.searchResults = [];
    this.showSuggestions = false;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  toggleAuthModal() {
    this.showAuthModal = !this.showAuthModal;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  // 👇 CIERRA dropdown y sugerencias al clicar fuera
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const dropdown = this.elementRef.nativeElement.querySelector('.dropdown');
    const searchBar = this.elementRef.nativeElement.querySelector('.search-bar');

    if (this.isDropdownOpen && !dropdown?.contains(event.target)) {
      this.isDropdownOpen = false;
    }

    if (this.showSuggestions && !searchBar?.contains(event.target)) {
      this.showSuggestions = false;
    }
  }

  onAvatarError() {
    if (this.currentUser) {
      this.currentUser.profileImage = undefined;
    }
  }
}
