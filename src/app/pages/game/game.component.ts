import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { GameScene } from "./scenes/game-scene";



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
      type: Phaser.AUTO,
      scale: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      physics: {
        default: 'arcade',
        arcade: {
          debug: true,
          gravity: {y: 600}
        },
      },
      input: {
        keyboard: true
      },
      parent: 'game',
      backgroundColor: '#000000',
      scene: [GameScene]
    };
  }
  ngOnInit() {
    const game = new Game(this.config);
  }
}

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

