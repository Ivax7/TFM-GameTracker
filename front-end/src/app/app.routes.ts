import { Routes } from '@angular/router';
import { GameDetailComponent } from './components/pages/game-detail/game-detail.component';
import { SearchResultsComponent } from './components/pages/search-results/search-results.component';
import { TrendingGamesComponent } from './components/pages/trending-games/trending-games.component';
import { WishlistComponent } from './components/pages/wishlist/wishlist.component';
import { MainPageComponent } from './main-page/main-page.component';
import { CollectionStatusComponent } from './components/pages/collection-status/collection-status.component';
import { SettingsComponent } from './components/pages/settings/settings.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'trending', component: TrendingGamesComponent },
  { path: 'search/:query', component: SearchResultsComponent },
  { path: 'detail/:id', component: GameDetailComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'collection', component: CollectionStatusComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: '' },
];
