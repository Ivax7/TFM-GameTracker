import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthModalComponent } from '../../auth/auth-modal/auth-modal.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, FormsModule, AuthModalComponent, RouterLink],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  query = '';
  showAuthModal = false;
  currentUser: any = null;
  isDropdownOpen = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.auth.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log(this.currentUser)
    });
  }

  searchGames() {
    if (!this.query.trim()) return;
    this.router.navigate(['/search', this.query]);
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
