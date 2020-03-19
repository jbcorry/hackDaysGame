import { Platform } from '../objects/platform';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class GameScene extends Phaser.Scene {
    private square: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    private platform: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    private matrixBack; compChipBack; foregroundLayer; map;
    private tileset;
    public isJumping = false;
  
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
        this.load.image('star', 'assets/images/star.png');
        this.load.image('plat-center', 'assets/images/platform-center.svg');
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
  
        this.physics.collide(this.square, this.platform);
        this.physics.collide(this.square, this.foregroundLayer);
        this.physics.collide(this.platform, this.foregroundLayer);

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
        if (this.square.y !== window.innerHeight - 50 && !this.square.body.touching.down && !this.platform.body.touching.up) {
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
            this.platforms.children.entries.forEach(element => {
                element.body.setVelocityX(0);
            });

            if (cursorKeys.up.isDown && !this.isJumping) {
                this.square.body.setVelocityY(-500);
            }
            if (this.square.x >= 650) {
                this.matrixBack.tilePositionX += .3;
                this.compChipBack.tilePositionX += 1;
                this.foregroundLayer.tilePositionX += 5;
                this.square.body.setVelocityX(0);
                this.platform.body.setVelocityX(-500);

                this.spawnPlat(time).then(() => {
                    this.platforms.children.entries.forEach(element => {
                        element.body.setVelocityX(-500);
                    });
                });


            }
        } else if (cursorKeys.left.isDown) {
            this.square.body.setVelocityX(-500);
            this.platform.body.setVelocityX(0);

            this.platforms.children.entries.forEach(element => {
                element.body.setVelocityX(0);
            });

            if (this.square.x <= 300) {
            this.matrixBack.tilePositionX -= .3;
            this.compChipBack.tilePositionX -= 1;
            this.foregroundLayer.tilePositionX -= 5;
            this.square.body.setVelocityX(0);
            this.platform.body.setVelocityX(500);

            this.platforms.children.entries.forEach(element => {
                element.body.setVelocityX(500);
            });
            }
            if (cursorKeys.up.isDown && !this.isJumping) {
            this.square.body.setVelocityY(-500);
            }
        } else if (cursorKeys.up.isDown && !this.isJumping) {
            this.square.body.setVelocityY(-500);
        } else {
            this.square.body.setVelocityX(0);
            this.platform.body.setVelocityX(0);
            this.platforms.children.entries.forEach(element => {
                element.body.setVelocityX(0);
            });
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
    private newPlat(): void {
        let plat: Phaser.Physics.Arcade.Image;
        let x = window.innerWidth + 100;
        let y = window.innerHeight - 100;
        plat = this.physics.add.image(x, y, 'plat-center');
        plat.body.collideWorldBounds = true;
        plat.body.immovable = true;
        plat.depth = 10;
        plat.setDisplaySize(this.randomNumber(50, 250), this.randomNumber(60, 220));
        this.physics.add.collider(plat, this.square);
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
