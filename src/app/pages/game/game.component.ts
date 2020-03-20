import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { GameScene } from "./scenes/game-scene";
import { GameOverScene } from "./scenes/game-over-scene";




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
  constructor() {
    this.config = {
      title: 'Deploy Game',
      loader: {
        user: "pee pee poo poo",
        password: "1"
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
    setTimeout(()=>{
      var timey = game.getTime();
      var score = game.scene;
      console.log(timey);
    }, 8000);
  }
}

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig, data) {
    super(config);
  }
}

