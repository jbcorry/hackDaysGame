
const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'GameOver',
};

export class GameOverScene extends Phaser.Scene {
    private score: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };

    private info: Phaser.GameObjects.Text;

    constructor() {
      super(sceneConfig);
    }
  
    public preload() {
    
        this.load.image('robo-victory', 'assets/images/player/robo-victory.png');
        this.load.html('game-over', 'assets/html/game-over.html');
  
    }
    public create() {
        console.log('game over');
        document.getElementById('game-over').style.display = 'block';

        this.add.dom(400, 600, 'div', 'top: 0').createFromCache('game-over');

        this.score = this.add.rectangle(0, 0, 0, 0, 0xFFFFFF) as any;
        this.score.depth = 0;
        this.physics.add.existing(this.score);
        this.score.body.collideWorldBounds = false;
        this.info = this.add.text(10, 10, '', { font: '24px Inconsolata', fill: '#FBFBAC' });
        this.info.depth = 10;

    }
    public update(time: number) {
  
    }
}
