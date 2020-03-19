
const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class GameScene extends Phaser.Scene {
    private square: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    private mainBack; middleBack; foregroundLayer; map;
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

    public preload() {
        this.load.tilemapTiledJSON('map', 'assets/map.json');
        this.load.spritesheet('tiles', 'assets/images/tiles.png', {frameWidth: 70, frameHeight: 70});
        this.load.image('middle-bg', 'assets/images/middle-bg.png');
        this.load.image('main-back', 'assets/images/main-bg.png');
        this.load.image('foregroundLayer', 'assets/images/floor.png');
        this.load.image('plat-center', 'assets/images/platform-center.png');
    }
    public create() {
        let windowWidth = this.game.canvas.width;
        let windowHeight = this.game.canvas.height;
        this.square = this.add.rectangle(200, windowHeight / 2 - 70, 100, 100, 0xFFFFFF) as any;
        this.square.depth = 10;
        this.physics.add.existing(this.square);
        this.square.body.collideWorldBounds = true;

        this.mainBack = this.add.tileSprite(windowWidth / 2, 0, windowWidth * 2, windowHeight, 'main-back');
        this.mainBack.depth = 0;
        this.mainBack.width = this.sys.canvas.width * 10;
        this.mainBack.height = this.sys.canvas.height * 10;
        this.mainBack.scaleX = .3;
        this.mainBack.scaleY = .3;
        this.middleBack = this.add.tileSprite(0, 1500, windowWidth, 500, 'middle-bg');
        this.middleBack.width = this.sys.canvas.width * 10;
        this.middleBack.height = this.sys.canvas.height * 10;
        this.middleBack.scaleX = .3;
        this.middleBack.scaleY = .3;
        this.middleBack.depth = 1;
        this.foregroundLayer = this.add.tileSprite(100, windowHeight - 30, windowWidth * 2, 80, 'foregroundLayer').setOrigin(1);
        this.foregroundLayer.depth = 5;
        this.physics.add.existing(this.foregroundLayer);
        this.foregroundLayer.body.collideWorldBounds = true;

        this.platforms = this.add.group();


    }
    public update(time: number) {

        this.physics.collide(this.square, this.foregroundLayer);

        this.platforms.children.entries.forEach(element => {
            if (element.body.x == 0 || element.body.x + element.body.width == this.game.config.width) {
                element.setDisplaySize(element.body.width - 7, element.body.height);
                if (element.body.width < 7) {
                    this.platforms.remove(element);
                    element.destroy();
                }
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
                this.mainBack.tilePositionX += .5;
                this.middleBack.tilePositionX += 2;
                this.foregroundLayer.tilePositionX += 8.3;
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
            this.mainBack.tilePositionX -= .5;
            this.middleBack.tilePositionX -= 2;
            this.foregroundLayer.tilePositionX -= 8.3;
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


    public spawnPlat(time: number) {
        const promise = new Promise((resolve, reject) => {
            const newPlatDiff: number = time - this.lastPlatTime;
            const randomPlatTime = Math.floor(Math.random() * 1000);
            const platforms = this.platforms.children.entries;
            let readyForPlat = true;
            if (platforms.length > 1) {
                const lastPlatPos = platforms[platforms.length - 1].body.x;
                if (lastPlatPos >= this.game.canvas.width - 450) {
                    readyForPlat = false;
                } else {
                    readyForPlat = true;
                }
            }
            if (newPlatDiff > this.delta && randomPlatTime > 600 && readyForPlat == true) {
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

    private newPlat(): void {
        let plat: Phaser.Physics.Arcade.Image;
        let randomHeight = this.randomNumber(100, 240);
        let randomWidth = this.randomNumber(100, 250);
        let x = this.game.canvas.width;
        let y = this.game.canvas.height;
        plat = this.physics.add.image(x, y, 'plat-center');
        plat.depth = 3;
        plat.setDisplaySize(randomWidth, randomHeight);
        plat.body.immovable = true;
        this.physics.add.collider(plat, this.square);
        const platforms = this.platforms.children.entries;
        if (platforms.length > 1) {
            const height = platforms[platforms.length - 1].body.height;
            const width = platforms[platforms.length - 1].body.width;
            const taller = this.randomNumber(0, 10);
            if (height < 200 && taller > 5) {
                plat.setDisplaySize(randomWidth, this.randomNumber(240, height + 200));
            } else {
                plat.setDisplaySize(randomWidth, randomHeight);
            }
        }
        this.plat = plat;
        this.plat.body.collideWorldBounds = true;
        this.platforms.add(plat);
      }

    // Function to generate random number
    public randomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }
  }
