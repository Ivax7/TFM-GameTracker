import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { filter } from 'rxjs';
import { ModalManagerController } from "./components/modal-manager/modal-manager.component";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, ModalManagerController, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  showNav = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // mostrar nav en todas las rutas excepto "/"
        this.showNav = event.urlAfterRedirects !== '/';
      });
  }
}
