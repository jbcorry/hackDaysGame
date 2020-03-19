import { Platform } from '../objects/platform';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class GameScene extends Phaser.Scene {
    private score: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    private square: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    private platform: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    private ground: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    private matrixBack; compChipBack; foregroundLayer; map;
    private tileset;
    public isJumping = false;
    public isFalling = false;
    public lastSpriteY = 0;

    //try robo sprite
    private robot: Phaser.GameObjects.Sprite & { body: Phaser.Physics.Arcade.Body };

  
    delta: number;
    lastStarTime: number;
    starsCaught: number;
    starsFallen: number;
    sand: Phaser.Physics.Arcade.StaticGroup;
    info: Phaser.GameObjects.Text;
  
    constructor() {
      super(sceneConfig);
    }
  
    init(params): void {
      this.delta = 1000;
      this.lastStarTime = 0;
      this.starsCaught = 0;
      this.starsFallen = 0;
    }

    //helper collide functions
    public squareCollideWithPlatform(square, platform) {
        if (square.body.touching.down && platform.body.touching.up) {
            console.log('jump again');
        }
    }

    public squareCollideWithGround() {
        console.log('to the ground!');
        this.square.body.y = window.innerHeight - 70;
    }
    public platCollideWithGround() {
        console.log('to the ground!');
        this.platform.y = window.innerHeight - 70;
    }

  
    public preload() {
    
        this.load.tilemapTiledJSON('map', 'assets/map.json');
        this.load.spritesheet('tiles', 'assets/images/tiles.png', {frameWidth: 70, frameHeight: 70});
        this.load.image('comp-chip', 'assets/images/computerchip.jpg');
        this.load.image('matrix-back', 'assets/images/matrix-bg.jpg');
        this.load.image('foregroundLayer', 'assets/images/floor.png');
    
        this.load.image('robo-idle', 'assets/images/player/robo-idle.svg');
        this.load.image('robo-jump', 'assets/images/player/robo-jump.svg');
        this.load.image('robo-back', 'assets/images/player/robo-back.svg');
        this.load.image('robo-forward', 'assets/images/player/robo-forward.svg');
        this.load.image('robo-spring', 'assets/images/player/robo-spring.svg');
  
    }
    public create() {
        this.score = this.add.rectangle(0, 0, 0, 0, 0xFFFFFF) as any;
        this.score.depth = 0;
        this.physics.add.existing(this.score);
        this.score.body.collideWorldBounds = false;
    
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        //robo sprite
        this.robot = this.add.sprite(200, windowHeight / 2 - 70, 'robo-forward');
        this.robot.setTexture('robo-idle');
        this.robot.height = 100;
        this.robot.width = 75;
        this.robot.setDisplaySize(75,100)
        this.robot.depth = 10;
        this.physics.add.existing(this.robot);
        this.robot.body.collideWorldBounds = true;
        console.log(this.robot)

        this.platform = this.add.rectangle(windowWidth, windowHeight - 70, 100, 200, 0xFFFFFF) as any;
        this.platform.depth = 10;
        this.physics.add.existing(this.platform);
        this.platform.body.collideWorldBounds = true;
        this.platform.body.immovable = true;

        // this.ground = this.add.rectangle(0, windowHeight, windowWidth * 2, 70, 0xFFFFFF) as any;
        // this.ground.depth = 10;
        // this.physics.add.existing(this.ground);
        // this.ground.body.collideWorldBounds = true;

        this.matrixBack = this.add.tileSprite(0, 0, windowWidth * 2, windowHeight, 'matrix-back');
        this.matrixBack.depth = 0;
        this.compChipBack = this.add.tileSprite(0, windowHeight, windowWidth * 2, windowHeight, 'comp-chip');
        this.compChipBack.depth = 1;
        this.foregroundLayer = this.add.tileSprite(100, windowHeight - 30, windowWidth * 2, 100, 'foregroundLayer');
        this.foregroundLayer.depth = 2;
    
        this.info = this.add.text(10, 10, '', { font: '24px Arial Bold', fill: '#FBFBAC' });
  
    }
    public update(time: number) {
  
        this.physics.collide(this.robot, this.platform, this.squareCollideWithPlatform, null, {
            this: this,
            square: this.robot,
            platform: this.platform
        });
        this.physics.collide(this.robot, this.foregroundLayer, this.squareCollideWithGround);
        this.physics.collide(this.platform, this.foregroundLayer, this.platCollideWithGround);
    
        const cursorKeys = this.input.keyboard.createCursorKeys();
        
        //restart game
        if (cursorKeys.space.isDown) {
          this.scene.restart();
        }

        // // check jumping
        // var jumpheight = window.innerHeight - this.robot.height + (this.robot.displayHeight / 2);
        // if (this.robot.y < jumpheight && !this.robot.body.touching.down && !this.platform.body.touching.up) {
        //     this.isJumping = true;
        // } else {
        //     this.isJumping = false;
        // }
        // check falling

        var goodY = Math.floor(this.robot.y);
        console.log(this.lastSpriteY, goodY, this.isFalling)
        if(this.lastSpriteY < goodY){
          this.isFalling = true;
          this.isJumping = true;
        } else if(this.lastSpriteY > goodY) {
          this.isFalling = false;
          this.isJumping = true;
        } else {
          if(goodY > 540){
            this.isFalling = false;
            this.isJumping = false;
          } else {
            this.isFalling = true;
            this.isJumping = true;
          }
        }
        this.lastSpriteY = goodY

        //movement
        if (cursorKeys.right.isDown) {
          this.GoRight(cursorKeys);
        } else if (cursorKeys.left.isDown) {
          this.GoLeft(cursorKeys);
        } else if (cursorKeys.up.isDown && !this.isJumping) {
            this.robot.body.setVelocityY(-500);
        } else {
          this.score.body.setVelocityX(0);  
          this.robot.body.setVelocityX(0);
          this.platform.body.setVelocityX(0);
          if(this.isJumping){
            this.robot.setTexture('robo-jump');
          } else {
            this.robot.setTexture('robo-idle');
          }
        }
        //set Score
        var goodScore = Math.floor(this.score.x);
        this.info.text = "SCORE: " + goodScore;
    }

    private GoRight(cursorKeys){
      this.score.body.setVelocityX(500);  
      this.robot.body.setVelocityX(500);
      this.robot.setTexture('robo-forward');
      this.platform.body.setVelocityX(0);
      if (cursorKeys.up.isDown && !this.isJumping) {
        this.robot.body.setVelocityY(-500);
      }
      if (this.robot.x >= 650) {
        this.matrixBack.tilePositionX += .3;
        this.compChipBack.tilePositionX += 1;
        this.foregroundLayer.tilePositionX += 5;
        this.score.body.setVelocityX(500);
        this.robot.body.setVelocityX(0);
        this.platform.body.setVelocityX(-500);
      }
    }

    private GoLeft(cursorKeys){
      this.score.body.setVelocityX(-500);  
      this.robot.body.setVelocityX(-500);
      this.robot.setTexture('robo-back');
      this.platform.body.setVelocityX(0);
      if (this.robot.x <= 300) {
        this.matrixBack.tilePositionX -= .3;
        this.compChipBack.tilePositionX -= 1;
        this.foregroundLayer.tilePositionX -= 5;
        this.score.body.setVelocityX(-500);
        this.robot.body.setVelocityX(0);
        this.platform.body.setVelocityX(500);
      }
      if (cursorKeys.up.isDown && !this.isJumping) {
        this.robot.body.setVelocityY(-500);
      }
    }
  }