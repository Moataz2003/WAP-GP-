import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateImageComponent } from './generate-image/generate-image.component';
// import { RegisterComponent } from './register/register.component';
// import { LoginComponent } from './login/login.component';
import { HistoryComponent } from './history/history.component';
import { HomeComponent } from './home/home.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { AuthComponent } from './auth/auth.component';
import { SdxlImg2imgComponent } from './sdxl-img2img/sdxl-img2img.component';
import { AuthGuard } from './guards/auth.guard';
import { LogoSimilarityComponent } from './logo-similarity/logo-similarity.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'app-home', component: HomeComponent },
  { path: 'generate-image', component: GenerateImageComponent, canActivate: [AuthGuard] },
  { path: 'app-history', component: HistoryComponent, canActivate: [AuthGuard] },
  { path: 'app-favorites', component: FavoritesComponent, canActivate: [AuthGuard] },
  { path: 'img2img', component: SdxlImg2imgComponent, canActivate: [AuthGuard] },
  { path: 'logo-similarity', component: LogoSimilarityComponent, canActivate: [AuthGuard] },
  {
    path: 'background-removal',
    loadChildren: () => import('./background-removal/background-removal.module').then(m => m.BackgroundRemovalModule),
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/app-home', pathMatch: 'full' },
  { path: '**', redirectTo: '/app-home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
