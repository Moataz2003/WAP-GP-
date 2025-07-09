import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { provideClientHydration } from '@angular/platform-browser';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { SharedModule } from './shared/shared.module';
import { BackgroundRemoverModule } from './shared/background-remover/background-remover.module';
import { LogoSimilarityComponent } from './logo-similarity/logo-similarity.component';
import { AuthModule } from './auth/auth.module';
import { GenerateImageComponent } from './generate-image/generate-image.component';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { FirstKeyPipe } from './shared/pipes/first-key.pipe';
import { HistoryComponent } from './history/history.component';
import { HomeComponent } from './home/home.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { AuthComponent } from './auth/auth.component';
import { SdxlImg2imgComponent } from './sdxl-img2img/sdxl-img2img.component';
import { BrandValidatorService } from './services/brand-validator.service';

@NgModule({
  declarations: [
    AppComponent,
    GenerateImageComponent,
    UserComponent,
    RegistrationComponent,
    FirstKeyPipe,
    HistoryComponent,
    HomeComponent,
    FavoritesComponent,
    SdxlImg2imgComponent,
    LogoSimilarityComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AuthModule,
    SharedModule,
    BackgroundRemoverModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    BrandValidatorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
