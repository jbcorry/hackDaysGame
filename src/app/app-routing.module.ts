import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GameComponent } from './pages/game/game.component';
import { HowToPlayComponent } from './pages/howToPlay/howToPlay.component';
import { LeaderboardComponent } from './pages/leaderboard/leaderboard.component';


const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: '', component: HomeComponent },
  { path: 'howToPlay', component: HowToPlayComponent },
  { path: 'leaderboard', component: LeaderboardComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
