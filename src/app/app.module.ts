import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './pages/game/game.component';
import { HomeComponent } from './pages/home/home.component';
import { SignupComponent } from './templates/signup/signup.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { FancytextComponent } from './templates/fancytext/fancytext.component';
import { HeaderComponent } from './templates/header/header.component';
import { FooterComponent } from './templates/footer/footer.component';
import { HowToPlayComponent } from './pages/howToPlay/howToPlay.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    HomeComponent,
    SignupComponent,
    FancytextComponent,
    HeaderComponent,
    FooterComponent,
    HowToPlayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
