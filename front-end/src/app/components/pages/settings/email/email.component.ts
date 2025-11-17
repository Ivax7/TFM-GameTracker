import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/user.service';
@Component({
  selector: 'app-email',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './email.component.html',
  styleUrl: './email.component.css'
})
export class EmailComponent implements OnInit {
  email: string = '';
  newEmail: string = '';

  constructor(
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.email = user.email;
        this.newEmail = user.email;
      },
      error: (err) => {
        console.log('Error loading profile', err);
      }
    })
  }

  updateEmail() {
    this.userService.updateEmail(this.newEmail).subscribe({
      next: () => {
        this.email = this.newEmail
      },
      error: (err) => console.log('Email updated')
    });
  }

}
