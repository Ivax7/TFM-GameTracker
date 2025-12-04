import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthModalComponent } from '../../auth/auth-modal/auth-modal.component';
import { AuthService } from '../../auth/auth.service';
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
  currentUser: any = null;
  isDropdownOpen = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    private rawgService: RawgService,
    private userService: UserService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.auth.currentUser$.subscribe(user => this.currentUser = user);

    this.searchSubject.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(query => {
        const trimmed = query.trim();
        if (!trimmed) return of([]); // no buscar nada si está vacío

        if (trimmed.startsWith('@')) {
          const username = trimmed.slice(1).trim();
          if (!username) return of([]); // evita q vacía
          this.searchingUsers = true;
          return this.userService.searchUsers(username);
        } else {
          this.searchingUsers = false;
          return this.rawgService.getGamesByName(trimmed);
        }
      })
    ).subscribe({
      next: res => {
        if (this.searchingUsers) {
          this.searchResults = Array.isArray(res) 
            ? res.slice(0, 5).map(u => ({
            ...u,
            profileImage: u.profileImage ? `http://localhost:3000/uploads/${u.profileImage}` : 'assets/images/icons/profile.svg'
          }))
          : [];
        } else {
          this.searchResults = res.results?.slice(0, 5) || [];
        }     

        this.showSuggestions = this.searchResults.length > 0;
      },
      error: () => {
        this.searchResults = [];
        this.showSuggestions = false;
      }
    });
  }

  onSearchChange() {
    this.searchSubject.next(this.query);
  }

search() {
  const trimmed = this.query.trim();
  if (!trimmed) return;

  if (trimmed.startsWith('@')) {
    const username = trimmed.slice(1).trim();
    if (!username) return;
    this.searchingUsers = true;
    // Navega usando parámetro de ruta
    this.router.navigate(['/users/search', username]);
  } else {
    this.searchingUsers = false;
    this.router.navigate(['/search', trimmed]);
  }

  this.resetSearch();
}

  selectItem(item: any) {
    if (this.searchingUsers) {
      this.router.navigate(['/user', item.username]);
    } else {
      this.router.navigate(['/detail', item.id]);
    }
    this.resetSearch();
  }

  resetSearch() {
    this.query = '';
    this.searchResults = [];
    this.showSuggestions = false;
  }

  toggleAuthModal() { this.showAuthModal = !this.showAuthModal; }
  logout() { this.auth.logout(); }
  toggleDropdown() { this.isDropdownOpen = !this.isDropdownOpen; }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const dropdown = this.elementRef.nativeElement.querySelector('.dropdown');
    if (this.isDropdownOpen && !dropdown?.contains(event.target)) this.isDropdownOpen = false;
  }
}
