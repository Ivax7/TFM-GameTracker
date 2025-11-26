import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthModalComponent } from '../../auth/auth-modal/auth-modal.component';
import { AuthService } from '../../auth/auth.service';
import { RawgService } from '../../services/rawg.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

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
  private searchSubject = new Subject<string>();


  showAuthModal = false;
  currentUser: any = null;
  isDropdownOpen = false;
  showSuggestions = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    private rawgService: RawgService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.auth.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

      this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query =>
        query.trim().length > 0 ? this.rawgService.getGamesByName(query) : []
      )
    ).subscribe({
      next: (res: any) => {
        this.searchResults = res.results?.slice(0, 5) || [];
        this.showSuggestions = this.searchResults.length > 0;
      },
      error: (err) => console.log(err)
    })
  }

  onSearchChange() {
    this.searchSubject.next(this.query);
  }

  searchGames() {
    if (!this.query.trim()) return;
    this.router.navigate(['/search', this.query]);
    this.showSuggestions = false;
    this.resetSearch();
  }

  selectGame(gameId: number) {
    this.router.navigate(['/detail', gameId]);
    this.resetSearch();
  }

  resetSearch() {
    this.query = '';
    this.searchResults = [];
    this.showSuggestions = false;
  }

  toggleAuthModal() {
    this.showAuthModal = !this.showAuthModal;
  }

  logout() {
    this.auth.logout();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const dropdown = this.elementRef.nativeElement.querySelector('.dropdown');
    const clickedInsideDropdown = dropdown?.contains(event.target);

    if (this.isDropdownOpen && !clickedInsideDropdown) {
      this.isDropdownOpen = false;
    }
  }

  

}
