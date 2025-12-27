import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { filter } from 'rxjs';
import { ModalManagerController } from "./components/modal-manager/modal-manager.component";
import { FooterComponent } from "./components/footer/footer.component";
import { AlertModalComponent } from "./components/shared/alert-modal/alert-modal.component";
import { AlertService } from './services/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavComponent, ModalManagerController, FooterComponent, AlertModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  showNav = false;
  constructor(
    private router: Router,
    public alertService: AlertService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showNav = event.urlAfterRedirects !== '/';
      });
  }
}
