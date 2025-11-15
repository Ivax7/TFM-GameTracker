import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { AccountComponent } from "./account/account.component";
import { EmailComponent } from "./email/email.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, UserProfileComponent, AccountComponent, EmailComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  selectedTab: 'profile' | 'account' | 'email' = 'account';

  selectTab(tab: 'profile' | 'account' | 'email') {
    this.selectedTab = tab;
  }
}
