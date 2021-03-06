
const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class GameScene extends Phaser.Scene {
    private mainBack; middleBack; foregroundLayer;
    private score: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    private timer: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    public isJumping = false;
    public isFalling = false;
    public lastSpriteY = 0;
    private timeTitle: Phaser.GameObjects.Text;
    private userTitle: Phaser.GameObjects.Text;
    private userinfo: Phaser.GameObjects.Text;
    private timeInfo: Phaser.GameObjects.Text;
    private homeTitle: Phaser.GameObjects.Text;
    private user: any;
    private timeRemaining: any;
    private timeLimit: any;
    public scoreNumber: Phaser.GameObjects.Text;
    private scoreBack;
    private homeBack;
    private goHome;
    

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
        this.load.image('black-back', 'assets/images/black.jpg');
        this.load.image('small-black', 'assets/images/small-black.jpg');
        this.load.image('go-home', 'assets/images/go-home.png');

    
        this.load.image('robo-idle', 'assets/images/player/robo-idle.png');
        this.load.image('robo-jump', 'assets/images/player/robo-jump.png');
        this.load.image('robo-back', 'assets/images/player/robo-back.png');
        this.load.image('robo-forward', 'assets/images/player/robo-forward.png');
        this.load.image('robo-spring', 'assets/images/player/robo-spring.png');
        this.load.image('block', 'assets/images/block.png');
  
    }
    public create() {
        let windowWidth = this.game.canvas.width;
        let windowHeight = this.game.canvas.height;

        // score and timer
        this.score = this.add.rectangle(0, 0, 0, 0, 0xFFFFFF) as any;
        this.scoreNumber = this.add.text(0, 0, '', { font: '1px Arial Bold', fill: '#41E0FF' });
        this.score.depth = 0;
        this.physics.add.existing(this.score);
        this.score.body.collideWorldBounds = false;
        var bigtext = { font: '45px Inconsolata', fill: '#41E0FF' };
        var smalltext = { font: '16px "Exo 2"', fill: '#41E0FF' };
        this.userinfo = this.add.text(350, 90, '', bigtext);
        this.timeInfo = this.add.text(180, 90, '', bigtext);
        this.userTitle = this.add.text(350, 60, '', smalltext);
        this.timeTitle = this.add.text(180, 60, '', smalltext);
        // this.userTitle.setShadow(1, 1, '#41E0FF', 3);
        // this.timeTitle.setShadow(1, 1, '#41E0FF', 3);
        // this.userinfo.setShadow(2, 2, '#41E0FF', 3);
        // this.timeInfo.setShadow(2, 2, '#41E0FF', 3);
        this.userinfo.depth = 10;
        this.timeInfo.depth = 10;
        this.userTitle.depth = 10;
        this.timeTitle.depth = 10;


        this.scoreBack = this.add.tileSprite(350, 100, 400, 150, 'black-back');
        this.scoreBack.fill = true;
        this.scoreBack.depth = 8;
        this.scoreBack.width = 406;
        this.scoreBack.height = 130;

        this.homeBack = this.add.tileSprite(85, 100, 100, 150, 'small-black');
        this.homeBack.fill = true;
        this.homeBack.depth = 8;
        this.homeBack.width = 100;
        this.homeBack.height = 130;

        this.homeTitle = this.add.text(60, 60, '', smalltext);
        this.homeTitle.text = "ROBOY";
        this.homeTitle.depth = 10;
        this.homeTitle.setShadow(1, 1, '#41E0FF', 10)
        this.goHome = this.add.tileSprite(85, 120, 25, 25, 'go-home');
        this.goHome.depth = 10;
        this.goHome.width = 48;
        this.goHome.height = 60;
        this.homeTitle.setInteractive();
        // this.homeTitle.on('pointerdown', onHomeClick());

        // function onHomeClick(): () => void {
        //     console.log("whyyyyy")
        //     // window.location.href = "/";
        //     return
        // }


        //user stuff
        this.user = this.game.config.loaderUser;
        this.timeRemaining = this.game.config.loaderPassword;

        //robo sprite
        this.robot = this.add.sprite(200, windowHeight / 2 - 70, 'robo-forward').setOrigin(0, 0);
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
        this.middleBack = this.add.tileSprite(this.sys.canvas.height, this.sys.canvas.height * 2 - 100, windowWidth, 500, 'middle-bg');
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
        var goodScore = Math.floor(this.score.x / 50);
        this.scoreNumber.text = goodScore.toString();
        this.timeRemaining -= 1 / 60;

        this.userTitle.text = this.user.toUpperCase() + "'S SCORE"; 
        this.timeTitle.text = "TIMER";
        this.userinfo.text = ""+goodScore; 
        this.timeInfo.text = ""+Math.ceil(this.timeRemaining);
    }

    private GoRight(cursorKeys, time){
        this.score.body.setVelocityX(500);
        if (this.robot.body.touching.right == true) {
            this.score.body.setVelocityX(0);
        }
        this.updateTexture('robo-forward');
        
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
            this.spawnPlat(time).then(() => {
                this.platforms.children.entries.forEach(element => {
                    element.body.setVelocityX(-500);
                });
            });
            this.robot.body.setVelocityX(0);
        } else {
            this.robot.body.setVelocityX(500);
        }
    }

    private GoLeft(cursorKeys){
        this.score.body.setVelocityX(-500);
        if (this.robot.body.touching.left == true) {
            this.score.body.setVelocityX(0);
        }
        this.updateTexture('robo-back');

        if (this.robot.x <= 300) {
            this.mainBack.tilePositionX -= .5;
            this.middleBack.tilePositionX -= 2;
            this.foregroundLayer.tilePositionX -= 8.3;
            this.score.body.setVelocityX(-500);
            this.robot.body.setVelocityX(0);
            this.platforms.children.entries.forEach(element => {
                element.body.setVelocityX(500);
            });
        } else {
            
            this.platforms.children.entries.forEach(element => {
                element.body.setVelocityX(0);
            });

            this.robot.body.setVelocityX(-500);
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
        let randomWidth = this.randomNumber(150, 350);
        let x = this.game.canvas.width;
        let y = this.game.canvas.height;
        plat = this.physics.add.image(x, y, 'block');
        plat.depth = 3;
        plat.setDisplaySize(randomWidth, randomHeight);
        plat.body.immovable = true;
        plat.setFrictionX(0);
        plat.setDisplaySize(this.randomNumber(100, 250), this.randomNumber(100, 220));
        this.physics.add.collider(plat, this.robot, this.smoothItOut, null, {robot: this.robot, plat});
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

    public smoothItOut(robot, plat) {
        // console.log(robot, plat);
    }
}
