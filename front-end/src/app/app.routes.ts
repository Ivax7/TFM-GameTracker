import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { TrendingGamesComponent } from './trending-games/trending-games.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'trending', component: TrendingGamesComponent },
  { path: 'search/:query', component: SearchResultsComponent },
  { path: '**', redirectTo: '' },

];
