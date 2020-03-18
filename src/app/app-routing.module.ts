import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GameComponent } from './pages/game/game.component';
import { TutorialComponent } from './pages/tutorial/tutorial.component';


const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: '', component: HomeComponent },
  { path: 'tutorial', component: TutorialComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
