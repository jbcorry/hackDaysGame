import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { GameScene } from "./scenes/game-scene";
import { GameOverScene } from "./scenes/game-over-scene";


import { RouterOutlet, Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';
import { timer } from 'rxjs';


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
  randomComment = this.mainService.randomComment();
  structuredTime;
  score = "Loading...";
  constructor(private router: Router, private mainService:MainService) {
    var state = this.router.getCurrentNavigation().extras.state;
    //for live
    state ? this.userData = state.data : this.router.navigate(['/']);
    //for testing
    // state ? this.userData = state.data : "";
    this.structuredTime = (parseInt(this.userData.time) * 60).toString();
    // this.structuredTime = 30;

    this.config = {
      title: 'Deploy Game',
      loader: {
        user: this.userData.username,
        password: this.structuredTime
      } ,
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
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
    console.log(game.isRunning)
    const promiseA = new Promise( (res,rej) => {
      if(game.isRunning){
        res();
      } else {
        promiseReturn(res);
      }
    });
    function promiseReturn(res){
      setTimeout(()=>{
        if(game.isRunning){
          return res();
        } else {
          promiseReturn(res);
        }
      },500)
    }
    promiseA.then(()=>{
      console.log('game ready')
      setTimeout(()=>{
        var score = game.scene.scenes[0].scoreNumber;
        this.score = score.text;
        if(this.score !== "Loading..."){
          this.sendScore();
        }
        game.scene.stop('Game');
        document.getElementById('game-over').style.display = 'block';
        document.getElementById('game-over').style.background = 'black';
      }, (this.structuredTime * 1000) + 2000);
    })
  }

  sendScore(){
      var score = {
        username: this.userData.username,
        score: this.score,
        time: this.userData.time
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

