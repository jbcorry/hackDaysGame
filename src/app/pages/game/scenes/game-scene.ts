import { Platform } from '../objects/platform';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class GameScene extends Phaser.Scene {
    private score: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    private platform: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
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
    plat;
    platforms;

    lastPlatTime: number;

  
    constructor() {
      super(sceneConfig);
    }
  
    init(params): void {
      this.delta = 1000;
      this.lastStarTime = 0;
      this.starsCaught = 0;
      this.starsFallen = 0;
      this.lastPlatTime = 0;
    }

    public spawnPlat(time: number) {
        const promise = new Promise((resolve, reject) => {
            const newPlatDiff: number = time - this.lastPlatTime;
            const randomPlatTime = Math.floor(Math.random() * 1000);
            if (newPlatDiff > this.delta && randomPlatTime > 800) {
                this.lastPlatTime = time;
                if (this.delta > 1000) {
                this.delta -= 20;
                }
                this.newPlat();
            }
            resolve();
        });
        return promise;
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
        this.load.image('plat-center', 'assets/images/platform-center.svg');
  
    }
    public create() {
        this.score = this.add.rectangle(0, 0, 0, 0, 0xFFFFFF) as any;
        this.score.depth = 0;
        this.physics.add.existing(this.score);
        this.score.body.collideWorldBounds = false;
    
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        //animations work

        this.anims.create({
          
        })

        //robo sprite
        this.robot = this.add.sprite(200, windowHeight / 2 - 70, 'robo-forward');
        this.robot.setTexture('robo-idle');
        this.robot.height = 100;
        this.robot.width = 75;
        this.robot.setDisplaySize(75,100);
        this.robot.depth = 10;
        this.physics.add.existing(this.robot);
        this.robot.body.collideWorldBounds = true;
        console.log(this.robot)

        this.platform = this.add.rectangle(windowWidth, windowHeight - 70, 100, 200, 0xFFFFFF) as any;
        this.platform.depth = 10;
        this.physics.add.existing(this.platform);
        this.platform.body.collideWorldBounds = true;
        this.platform.body.immovable = true;

        this.matrixBack = this.add.tileSprite(0, 0, windowWidth * 2, windowHeight, 'matrix-back');
        this.matrixBack.depth = 0;
        this.compChipBack = this.add.tileSprite(0, windowHeight, windowWidth * 2, windowHeight, 'comp-chip');
        this.compChipBack.depth = 1;
        this.foregroundLayer = this.add.tileSprite(100, windowHeight - 30, windowWidth * 2, 100, 'foregroundLayer');
        this.foregroundLayer.depth = 2;
    
        this.info = this.add.text(10, 10, '', { font: '24px Arial Bold', fill: '#FBFBAC' });
  
        this.platforms = this.add.group();

    }
    public update(time: number) {
  
        this.physics.collide(this.robot, this.platform);
        this.physics.collide(this.robot, this.foregroundLayer);
        this.physics.collide(this.platform, this.foregroundLayer);    
    
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
        var jumpheight = window.innerHeight + 8 - this.robot.height;
        if(this.robot.body.touching.down || goodY > jumpheight){
          this.isFalling = false;
          this.isJumping = false;
        } else {
          this.isFalling = true;
          this.isJumping = true;
        }
        // if(this.lastSpriteY < goodY){
        //   this.isFalling = true;
        //   this.isJumping = true;
        // } else if(this.lastSpriteY > goodY) {
        //   this.isFalling = false;
        //   this.isJumping = true;
        // } else {
        //   if(this.robot.body.touching.down || goodY > jumpheight){
        //     console.log('OK ITS HERE')
        //     console.log(this.robot.body.touching.down, goodY, jumpheight)
        //     this.isFalling = false;
        //     this.isJumping = false;
        //   } else {
        //     this.isFalling = true;
        //     this.isJumping = true;
        //   }
        // }
        // this.lastSpriteY = goodY

        //movement
        if (cursorKeys.right.isDown) {
          this.GoRight(cursorKeys, time);
        } else if (cursorKeys.left.isDown) {
          this.GoLeft(cursorKeys);
        } else if (cursorKeys.up.isDown && !this.isJumping) {
            this.robot.body.setVelocityY(-500);
        } else {
          this.score.body.setVelocityX(0);  
          this.robot.body.setVelocityX(0);
          this.platform.body.setVelocityX(0);
          this.platforms.children.entries.forEach(element => {
              element.body.setVelocityX(0);
          });
          if(this.isJumping){
            this.updateTexture('robo-jump');
          } else {
            this.updateTexture('robo-idle');
          }
        }
        //set Score
        var goodScore = Math.floor(this.score.x);
        this.info.text = "SCORE: " + goodScore;
    }

    private GoRight(cursorKeys, time){
      this.score.body.setVelocityX(500);  
      this.updateTexture('robo-forward');
      this.robot.body.setVelocityX(500);
      this.platform.body.setVelocityX(0);
      this.platforms.children.entries.forEach(element => {
        element.body.setVelocityX(0);
      });
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
        this.spawnPlat(time).then(() => {
          this.platforms.children.entries.forEach(element => {
              element.body.setVelocityX(-500);
          });
        });
      }
    }

    private GoLeft(cursorKeys){
      this.score.body.setVelocityX(-500);  
      this.updateTexture('robo-back');
      this.robot.body.setVelocityX(-500);
      this.platform.body.setVelocityX(0);
      this.platforms.children.entries.forEach(element => {
        element.body.setVelocityX(0);
      });
      if (this.robot.x <= 300) {
        this.matrixBack.tilePositionX -= .3;
        this.compChipBack.tilePositionX -= 1;
        this.foregroundLayer.tilePositionX -= 5;
        this.score.body.setVelocityX(-500);
        this.robot.body.setVelocityX(0);
        this.platform.body.setVelocityX(500);
        this.platforms.children.entries.forEach(element => {
          element.body.setVelocityX(500);
        });
      }
      if (cursorKeys.up.isDown && !this.isJumping) {
        this.robot.body.setVelocityY(-500);
      }
    }
    private updateTexture(texture){
      console.log(this.robot.x, this.robot.y, "start")
      var x = this.robot.x;
      var y = this.robot.y;
      this.robot.setTexture(texture);
      this.robot.height = 100;
      this.robot.width = 75;
      console.log(this.robot.x, this.robot.y, "end")
      this.robot.setX(x);
      this.robot.setY(y);
    }
    private newPlat(): void {
        let plat: Phaser.Physics.Arcade.Image;
        let x = window.innerWidth + 100;
        let y = window.innerHeight - 100;
        plat = this.physics.add.image(x, y, 'plat-center');
        plat.body.collideWorldBounds = true;
        plat.body.immovable = true;
        plat.depth = 10;
        plat.setDisplaySize(this.randomNumber(50, 250), this.randomNumber(60, 220));
        this.physics.add.collider(plat, this.robot);
        const platforms = this.platforms.children.entries;
        if (platforms.length > 1) {
            const height = platforms[platforms.length - 1].body.height;
            const width = platforms[platforms.length - 1].body.width;
            const taller = this.randomNumber(0, 10);
            if (height < 200 && taller > 5) {
                plat.setDisplaySize(this.randomNumber(50, 250), this.randomNumber(220, height + 220));
            } else {
                plat.setDisplaySize(this.randomNumber(50, 250), this.randomNumber(60, 220));
            }
        }
        this.platforms.add(plat);
      }

    // Function to generate random number
    public randomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }
  }
