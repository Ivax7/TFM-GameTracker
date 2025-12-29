// home.component.ts
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrendingGamesComponent } from './trending-games/trending-games.component';
import { Top250GamesComponent } from './top-250-games/top-250-games.component';
import { TopIndieGamesComponent } from './top-indie-games/top-indie-games.component';

type HomeSection = 'trending' | 'top250' | 'indies';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TrendingGamesComponent,
    Top250GamesComponent,
    TopIndieGamesComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  selectedSection: HomeSection = 'trending';
  isSidebarVisible = true; // Cambié el nombre para claridad
  
  // Para móvil: controlar si el sidebar está abierto
  isMobileSidebarOpen = false;
  
  // Detectar si es móvil
  isMobile = window.innerWidth <= 1024;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = window.innerWidth <= 1024;
    // En desktop, siempre mostrar sidebar por defecto
    if (!this.isMobile) {
      this.isMobileSidebarOpen = false;
    }
  }

  selectSection(section: HomeSection) {
    this.selectedSection = section;
    // En móvil, cerrar sidebar al seleccionar
    if (this.isMobile) {
      this.isMobileSidebarOpen = false;
    }
  }

  toggleSidebar() {
    if (this.isMobile) {
      // En móvil: toggle del overlay/sidebar
      this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
    } else {
      // En desktop: mostrar/ocultar completamente
      this.isSidebarVisible = !this.isSidebarVisible;
    }
  }

  // Método para saber si el sidebar se debe mostrar
  get shouldShowSidebar(): boolean {
    if (this.isMobile) {
      return this.isMobileSidebarOpen;
    }
    return this.isSidebarVisible;
  }
}