import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  selectedTab: 'profile' | 'account' | 'email' = 'profile';

  selectTab(tab: 'profile' | 'account' | 'email') {
    this.selectedTab = tab;
  }
}
