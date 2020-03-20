
const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class GameScene extends Phaser.Scene {
    private mainBack; middleBack; foregroundLayer;
    private score: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    public isJumping = false;
    public isFalling = false;
    public lastSpriteY = 0;
    private info: Phaser.GameObjects.Text;

    //try robo sprite
    // private robot: Phaser.GameObjects.Sprite & { body: Phaser.Physics.Arcade.Body };
    private robot: any;

  
    delta: number;
    lastPlatTime: number;
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
        this.load.image('middle-bg', 'assets/images/middle-bg.png');
        this.load.image('main-back', 'assets/images/main-bg.png');
        this.load.image('foregroundLayer', 'assets/images/floor.png');
    
        this.load.image('robo-idle', 'assets/images/player/robo-idle.png');
        this.load.image('robo-jump', 'assets/images/player/robo-jump.png');
        this.load.image('robo-back', 'assets/images/player/robo-back.png');
        this.load.image('robo-forward', 'assets/images/player/robo-forward.png');
        this.load.image('robo-spring', 'assets/images/player/robo-spring.png');
        this.load.image('plat-center', 'assets/images/platform-center.png');
  
    }
    public create() {
        let windowWidth = this.game.canvas.width;
        let windowHeight = this.game.canvas.height;
        this.score = this.add.rectangle(0, 0, 0, 0, 0xFFFFFF) as any;
        this.score.depth = 0;
        this.physics.add.existing(this.score);
        this.score.body.collideWorldBounds = false;
        this.info = this.add.text(10, 10, '', { font: '24px Arial Bold', fill: '#FBFBAC' });
        this.info.depth = 10;
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
        // this.robot.body.setBounce(0.2);

        this.mainBack = this.add.tileSprite(windowWidth / 2, 0, windowWidth * 2, windowHeight, 'main-back');
        this.mainBack.depth = 0;
        this.mainBack.width = this.sys.canvas.width * 10;
        this.mainBack.height = this.sys.canvas.height * 10;
        this.mainBack.scaleX = .3;
        this.mainBack.scaleY = .3;
        this.middleBack = this.add.tileSprite(0, this.sys.canvas.height * 2 - 100, windowWidth, 500, 'middle-bg');
        this.middleBack.width = this.sys.canvas.width * 10;
        this.middleBack.height = this.sys.canvas.height * 10;
        this.middleBack.scaleX = .3;
        this.middleBack.scaleY = .3;
        this.middleBack.depth = 1;
        this.foregroundLayer = this.add.tileSprite(0, windowHeight - 30, windowWidth * 2, 80, 'foregroundLayer');
        this.foregroundLayer.depth = 5;
        this.physics.add.existing(this.foregroundLayer, true);
        this.foregroundLayer.body.collideWorldBounds = true;

        this.platforms = this.add.group();


    }
    public update(time: number) {
  
        this.physics.collide(this.robot, this.platforms);
        this.physics.collide(this.robot, this.foregroundLayer);
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
        
        //restart game
        if (cursorKeys.space.isDown) {
          this.scene.restart();
        }

        // // check jumping
        var goodY = Math.floor(this.robot.y);
        var jumpheight = window.innerHeight + 8 - this.robot.height;
        if(this.robot.body.touching.down || goodY > jumpheight){
          this.isFalling = false;
          this.isJumping = false;
        } else {
          this.isFalling = true;
          this.isJumping = true;
        }

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
        console.log(this.info);
        this.info.text = "SCORE: " + goodScore; 
    }

    private GoRight(cursorKeys, time){
      this.score.body.setVelocityX(500);
      this.updateTexture('robo-forward');
      this.robot.body.setVelocityX(500);
      
      this.platforms.children.entries.forEach(element => {
        element.body.setVelocityX(0);
      });
      if (cursorKeys.up.isDown && !this.isJumping) {
        this.robot.body.setVelocityY(-500);
      }
      if (this.robot.x >= 650) {
        this.mainBack.tilePositionX += .5;
        this.middleBack.tilePositionX += 2;
        this.foregroundLayer.tilePositionX += 8.3;
        this.score.body.setVelocityX(500);
        this.robot.body.setVelocityX(0);
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

      this.platforms.children.entries.forEach(element => {
        element.body.setVelocityX(0);
      });
      if (this.robot.x <= 300) {
        this.mainBack.tilePositionX -= .5;
        this.middleBack.tilePositionX -= 2;
        this.foregroundLayer.tilePositionX -= 8.3;
        this.score.body.setVelocityX(-500);
        this.robot.body.setVelocityX(0);
        
        this.platforms.children.entries.forEach(element => {
          element.body.setVelocityX(500);
        });
      }
      if (cursorKeys.up.isDown && !this.isJumping) {
        this.robot.body.setVelocityY(-500);
      }
    }
    private updateTexture(texture){
      var x = this.robot.x;
      var y = this.robot.y;
      this.robot.setTexture(texture);
      this.robot.height = 100;
      this.robot.width = 75;
      this.robot.setX(x);
      this.robot.setY(y);
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
        plat.setDisplaySize(this.randomNumber(100, 250), this.randomNumber(100, 220));
        this.physics.add.collider(plat, this.robot);
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
