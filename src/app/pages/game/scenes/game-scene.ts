
const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class GameScene extends Phaser.Scene {
    private square: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    private matrixBack; compChipBack; foregroundLayer; map;
    private tileset;
    public isJumping = false;
  
    delta: number;
    lastPlatTime: number;
    info: Phaser.GameObjects.Text;
    plat;
    platforms;

    constructor() {
      super(sceneConfig);
    }
  
    init(params): void {
      this.delta = 1000;
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
        this.load.image('plat-center', 'assets/images/platform-center.png');
    }
    public create() {
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        this.square = this.add.rectangle(200, windowHeight / 2 - 70, 100, 100, 0xFFFFFF) as any;
        this.square.depth = 10;
        this.physics.add.existing(this.square);
        this.square.body.collideWorldBounds = true;

        this.matrixBack = this.add.tileSprite(0, 0, windowWidth * 2, windowHeight, 'matrix-back');
        this.matrixBack.depth = 0;
        this.compChipBack = this.add.tileSprite(0, windowHeight, windowWidth * 2, windowHeight, 'comp-chip');
        this.compChipBack.depth = 1;
        this.foregroundLayer = this.add.tileSprite(100, windowHeight - 30, windowWidth * 2, 100, 'foregroundLayer');
        this.foregroundLayer.depth = 2;

        this.platforms = this.add.group();

    }
    public update(time: number) {

        this.physics.collide(this.square, this.foregroundLayer);

        this.platforms.children.entries.forEach(element => {
            if (element.body.x == 0) {
                element.destroy();
            }
        });

        const cursorKeys = this.input.keyboard.createCursorKeys();
        // if (cursorKeys.up.isDown) {
        //   this.square.body.setVelocityY(-500);
        // } else if (cursorKeys.down.isDown) {
        //   this.square.body.setVelocityY(500);
        // } else {
        //   this.square.body.setVelocityY(0);
        // }
        if (this.square.y !== window.innerHeight - 50 && !this.square.body.touching.down) {
            this.isJumping = true;
        } else {
            this.isJumping = false;
        }
        if (cursorKeys.space.isDown) {
            this.scene.restart();
        }
        if (cursorKeys.right.isDown) {

            this.square.body.setVelocityX(500);
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

                this.spawnPlat(time).then(() => {
                    this.platforms.children.entries.forEach(element => {
                        element.body.setVelocityX(-500);
                    });
                });


            }
        } else if (cursorKeys.left.isDown) {
            this.square.body.setVelocityX(-500);

            this.platforms.children.entries.forEach(element => {
                element.body.setVelocityX(0);
            });

            if (this.square.x <= 300) {
            this.matrixBack.tilePositionX -= .3;
            this.compChipBack.tilePositionX -= 1;
            this.foregroundLayer.tilePositionX -= 5;
            this.square.body.setVelocityX(0);

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
            this.platforms.children.entries.forEach(element => {
                element.body.setVelocityX(0);
            });
        }
    }

    private newPlat(): void {
        let plat: Phaser.Physics.Arcade.Image;
        let x = window.innerWidth + 100;
        let y = window.innerHeight - 100;
        plat = this.physics.add.image(x, y, 'plat-center');
        plat.body.immovable = true;
        plat.depth = 10;
        plat.setDisplaySize(this.randomNumber(50, 250), this.randomNumber(60, 200));
        this.physics.add.collider(plat, this.square);
        const platforms = this.platforms.children.entries;
        if (platforms.length > 1) {
            const height = platforms[platforms.length - 1].body.height;
            const width = platforms[platforms.length - 1].body.width;
            const taller = this.randomNumber(0, 10);
            if (height < 200 && taller > 5) {
                plat.setDisplaySize(this.randomNumber(50, 250), this.randomNumber(200, height + 200));
            } else {
                plat.setDisplaySize(this.randomNumber(50, 250), this.randomNumber(60, 220));
            }
        }
        console.log(platforms);
        this.plat = plat;
        this.plat.body.collideWorldBounds = true;
        this.platforms.add(plat);
      }

    // Function to generate random number
    public randomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }
  }
