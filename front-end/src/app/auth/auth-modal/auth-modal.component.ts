import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
// import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent {

  @Output() close = new EventEmitter<void>()

  email = '';
  password = '';
  username = '';
  isLoginMode = true;
  message = '';

  constructor(private authService: AuthService) {}

  setMode(isLogin: boolean) {
    this.isLoginMode = isLogin;
    this.message = '';
    if (isLogin) this.username = '';
  }

onSubmit() {
  if (this.isLoginMode) {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.message = '✅ Login successful!';
        setTimeout(() => this.close.emit(), 800); // Cierra el modal tras 0.8s
      },
      error: () => this.message = '❌ Invalid credentials'
    });
  } else {
    this.authService.register(this.email, this.password, this.username).subscribe({
      next: () => this.message = '✅ Account created! You can log in now.',
      error: err => this.message = '❌ Registration failed'
    });
  }
}

}
