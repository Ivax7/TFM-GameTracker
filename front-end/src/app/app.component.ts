import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthModalComponent } from './auth/auth-modal/auth-modal.component';
import { MainPageComponent } from "./main-page/main-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AuthModalComponent,
    MainPageComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'front-end';
}
