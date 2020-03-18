import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})


//Starfall example

// export class GameComponent implements OnInit {
//   phaserGame: Phaser.Game;
//   config: Phaser.Types.Core.GameConfig;
//   constructor() {
//     this.config = {
//       title: 'Starfall',
//       type: Phaser.AUTO,
//       scale: {
//         width: window.innerWidth,
//         height: window.innerHeight,
//       },
//       physics: {
//         default: 'arcade',
//         arcade: {
//           debug: true,
//         },
//       },
//       parent: 'game',
//       backgroundColor: '#18216D',
//       scene: [StarFallScene]
//     };
//   }
//   ngOnInit() {
//     this.phaserGame = new Phaser.Game(this.config);
//   }
// }

// class StarFallScene extends Phaser.Scene {
//   delta: number;
//   lastStarTime: number;
//   starsCaught: number;
//   starsFallen: number;
//   sand: Phaser.Physics.Arcade.StaticGroup;
//   info: Phaser.GameObjects.Text;
//   constructor() {
//       super({
//         key: "StarFallScene"
//       });
//     }
//   init(params): void {
//     this.delta = 1000;
//     this.lastStarTime = 0;
//     this.starsCaught = 0;
//     this.starsFallen = 0;
//   }
//   preload(): void {
//     this.load.setBaseURL(
//       "https://raw.githubusercontent.com/mariyadavydova/" +
//       "starfall-phaser3-typescript/master/");
//     this.load.image("star", "assets/star.png");
//     this.load.image("sand", "assets/sand.jpg");
//     }
//     create(): void {
//       this.sand = this.physics.add.staticGroup({
//         key: 'sand',
//         frameQuantity: 20
//       });
//       Phaser.Actions.PlaceOnLine(this.sand.getChildren(),
//         new Phaser.Geom.Line(20, 580, 820, 580));
//       this.sand.refresh();
//       this.info = this.add.text(10, 10, '', { font: '24px Arial Bold', fill: '#FBFBAC' });
//     }
//   update(time: number): void {
//     const diff: number = time - this.lastStarTime;
//     if (diff > this.delta) {
//       this.lastStarTime = time;
//       if (this.delta > 500) {
//         this.delta -= 20;
//       }
//       this.emitStar();
//     }
//     this.info.text =
//       this.starsCaught + " caught - " +
//       this.starsFallen + " fallen (max 3)";
//   }
//   private onClick(star: Phaser.Physics.Arcade.Image): () => void {
//     return function () {
//       star.setTint(0x00ff00);
//       star.setVelocity(0, 0);
//       this.starsCaught += 1;
//       this.time.delayedCall(100, function (star) {
//         star.destroy();
//       }, [star], this);
//     }
//   }
//   private onFall(star: Phaser.Physics.Arcade.Image): () => void {
//     return function () {
//       star.setTint(0xff0000);
//       this.starsFallen += 1;
//       this.time.delayedCall(100, function (star) {
//         star.destroy();
//       }, [star], this);
//     }
//   }
//   private emitStar(): void {
//     var star: Phaser.Physics.Arcade.Image;
//     var x = Phaser.Math.Between(25, 775);
//     var y = 26;
//     star = this.physics.add.image(x, y, "star");
//     star.setDisplaySize(50, 50);
//     star.setVelocity(0, 200);
//     star.setInteractive();
//     star.on('pointerdown', this.onClick(star), this);
//     this.physics.add.collider(star, this.sand, 
//       this.onFall(star), null, this);
//   }
// }


//MAZE EXAMPLE

export class GameComponent implements OnInit {
  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;
  FromInGame: any;
  load: any;
  add: any;
  constructor() {
    this.config = {
      title: 'Sample',
      type: Phaser.AUTO,
      scale: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      physics: {
        default: 'arcade',
        arcade: {
          debug: true,
        },
      },
      parent: 'game',
      backgroundColor: '#000000',
      scene: GameScene
    };
  }
  ngOnInit() {
    let game = new Phaser.Game(this.config);
  }
}

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class GameScene extends Phaser.Scene {
  private square: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
  private matrixBack; compChipBack;
  constructor() {
    super(sceneConfig);
  }
  public preload() {

    this.load.image('comp-chip', 'assets/images/computerchip.jpg');
    this.load.image('matrix-back', 'assets/images/matrix-bg.jpg');

  }
  public create() {

    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    this.square = this.add.rectangle(200, windowHeight / 2, 100, 100, 0xFFFFFF) as any;
    this.square.depth = 10;
    this.physics.add.existing(this.square);
    // this.matrixBack = this.add.tileSprite(0,
    //   this.game.canvas.height = this.game.cache.getImage('matrix-back').height,
    //   this.game.canvas.width,
    //   this.game.cache.getImage('matrix-back').height, 'matrix-back'
    // )
    this.matrixBack = this.add.tileSprite(0, 0, windowWidth, windowHeight, 'matrix-back');
    this.matrixBack.depth = 0;
    this.compChipBack = this.add.tileSprite(0, windowHeight / 2, windowWidth, windowHeight / 2, 'comp-chip');
    this.compChipBack.depth = 1;
  }
  public update() {

    const cursorKeys = this.input.keyboard.createCursorKeys();
    // if (cursorKeys.up.isDown) {
    //   this.square.body.setVelocityY(-500);
    // } else if (cursorKeys.down.isDown) {
    //   this.square.body.setVelocityY(500);
    // } else {
    //   this.square.body.setVelocityY(0);
    // }
    if (cursorKeys.right.isDown) {
      this.matrixBack.tilePositionX += .3;
      this.compChipBack.tilePositionX += 1;
      this.square.body.setVelocityX(500);
    } else if (cursorKeys.left.isDown) {
      this.matrixBack.tilePositionX -= .3;
      this.compChipBack.tilePositionX -= 1;
      this.square.body.setVelocityX(-500);
    } else {
      this.square.body.setVelocityX(0);
    }
  }
}

