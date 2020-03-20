import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { GameScene } from "./scenes/game-scene";
import { GameOverScene } from "./scenes/game-over-scene";


import { RouterOutlet, Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})


export class GameComponent implements OnInit {
  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;
  FromInGame: any;
  load: any;
  add: any;
  userData = {
    username: "Default",
    time: "2"
  }
  score;
  constructor(private router: Router, private mainService:MainService) {
    var state = this.router.getCurrentNavigation().extras.state;
    //for live
    // state ? this.userData = state.data : this.router.navigate(['/']);
    //for testing
    state ? this.userData = state.data : "";

    this.config = {
      title: 'Deploy Game',
      loader: {
        user: this.userData.username,
        password: this.userData.time
      } ,
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      physics: {
        default: 'arcade',
        arcade: {
          debug: true,
          tileBias: 8,
          gravity: {y: 600}
        },
      },
      input: {
        keyboard: true
      },
      parent: 'game',
      backgroundColor: '#000000',
      scene: [GameScene],
    };
  }
  ngOnInit() {
    var data = {poop: "poopy"};
    const game = new Game(this.config , data);
    var timeToPlay = parseInt(this.userData.time) * 60 * 100;
    // var timeToPlay = parseInt(this.userData.time) * 60 * 1000;
    setTimeout(()=>{
      var score = game.scene.scenes[0].scoreNumber;
      this.score = score.text;
      alert("Your score is: " + score.text + ' NOW GET BACK TO WORK NERD!');
      this.sendScore();
      this.router.navigate(['/']);
    }, timeToPlay)
  }

  sendScore(){
      var score = {
        username: this.userData.username,
        score: this.score
      }
      console.log('this is sending to the datatbase', score)
      this.mainService.createScore(score);
  }


}

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig, data) {
    super(config);
  }
}

