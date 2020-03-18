import { Platform } from '../objects/platform';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class GameScene extends Phaser.Scene {
    private square: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    private platform: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    private ground: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    private matrixBack; compChipBack; foregroundLayer; map;
    private tileset;
    public isJumping = false;
  
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
    public squareCollideWithPlatform() {
        console.log('boom!');
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
    
        
        this.load.image('star', 'assets/images/star.png');
  
    }
    public create() {
    
    
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        this.square = this.add.rectangle(200, windowHeight / 2 - 70, 100, 100, 0xFFFFFF) as any;
        this.square.depth = 10;
        this.physics.add.existing(this.square);
        this.square.body.collideWorldBounds = true;

        this.platform = this.add.rectangle(windowWidth, windowHeight - 70, 100, 200, 0xFFFFFF) as any;
        this.platform.depth = 10;
        this.physics.add.existing(this.platform);
        this.platform.body.collideWorldBounds = true;

        this.ground = this.add.rectangle(0, windowHeight, windowWidth * 2, 70, 0xFFFFFF) as any;
        this.ground.depth = 10;
        this.physics.add.existing(this.ground);
        this.ground.body.collideWorldBounds = true;

        this.matrixBack = this.add.tileSprite(0, 0, windowWidth * 2, windowHeight, 'matrix-back');
        this.matrixBack.depth = 0;
        this.compChipBack = this.add.tileSprite(0, windowHeight, windowWidth * 2, windowHeight, 'comp-chip');
        this.compChipBack.depth = 1;
        this.foregroundLayer = this.add.tileSprite(100, windowHeight - 30, windowWidth * 2, 100, 'foregroundLayer');
        this.foregroundLayer.depth = 2;
    
        this.info = this.add.text(10, 10, '', { font: '24px Arial Bold', fill: '#FBFBAC' });
  
    }
    public update(time: number) {
  
        this.physics.collide(this.square, this.platform, this.squareCollideWithPlatform);
        this.physics.collide(this.square, this.foregroundLayer, this.squareCollideWithGround);
        this.physics.collide(this.platform, this.foregroundLayer, this.platCollideWithGround);



        const diff: number = time - this.lastStarTime;
        if (diff > this.delta) {
            this.lastStarTime = time;
            if (this.delta > 500) {
            this.delta -= 20;
            }
            this.emitStar();
        }
        this.info.text =
            this.starsCaught + ' caught - ' +
            this.starsFallen + ' fallen (max 3)';
    
    
        const cursorKeys = this.input.keyboard.createCursorKeys();
        // if (cursorKeys.up.isDown) {
        //   this.square.body.setVelocityY(-500);
        // } else if (cursorKeys.down.isDown) {
        //   this.square.body.setVelocityY(500);
        // } else {
        //   this.square.body.setVelocityY(0);
        // }
        if (this.square.y !== window.innerHeight - 50) {
            this.isJumping = true;
        } else {
            this.isJumping = false;
        }
        if (cursorKeys.space.isDown) {
            this.scene.restart();
        }
        if (cursorKeys.right.isDown) {
    
            this.square.body.setVelocityX(500);
            this.platform.body.setVelocityX(0);

            if (cursorKeys.up.isDown && !this.isJumping) {
            this.square.body.setVelocityY(-500);
            }
            if (this.square.x >= 650) {
            this.matrixBack.tilePositionX += .3;
            this.compChipBack.tilePositionX += 1;
            this.foregroundLayer.tilePositionX += 5;
            this.square.body.setVelocityX(0);
            this.platform.body.setVelocityX(-500);

            }
        } else if (cursorKeys.left.isDown) {
            this.square.body.setVelocityX(-500);
            this.platform.body.setVelocityX(0);

            if (this.square.x <= 300) {
            this.matrixBack.tilePositionX -= .3;
            this.compChipBack.tilePositionX -= 1;
            this.foregroundLayer.tilePositionX -= 5;
            this.square.body.setVelocityX(0);
            this.platform.body.setVelocityX(500);
            }
            if (cursorKeys.up.isDown && !this.isJumping) {
            this.square.body.setVelocityY(-500);
            }
        } else if (cursorKeys.up.isDown && !this.isJumping) {
            this.square.body.setVelocityY(-500);
        } else {
            this.square.body.setVelocityX(0);
            this.platform.body.setVelocityX(0);
        }
    }
  
    private onClick(star: Phaser.Physics.Arcade.Image): () => void {
      return function() {
        star.setTint(0x00ff00);
        star.setVelocity(0, 0);
        this.starsCaught += 1;
        this.time.delayedCall(100, (star) => {
          star.destroy();
        }, [star], this);
      }
    }
    private onFall(star: Phaser.Physics.Arcade.Image): () => void {
      return () => {
        star.setTint(0xff0000);
        this.starsFallen += 1;
        this.time.delayedCall(100, (star) => {
          star.destroy();
        }, [star], this);
      }
    }
    private emitStar(): void {
      let star: Phaser.Physics.Arcade.Image;
      let x = Phaser.Math.Between(25, 775);
      let y = 26;
      star = this.physics.add.image(x, y, 'star');
      star.setDisplaySize(50, 50);
      star.setVelocity(0, 200);
      star.setInteractive();
      star.on('pointerdown', this.onClick(star), this);
      this.physics.add.collider(star, this.sand, this.onFall(star), null, this);
    }
  }