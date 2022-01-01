import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    // this.load.image('floor', '../assets/src/floor/floor.png'); // подгружаем исходник для сцены
    // this.load.image('wall', '../assets/src/walls/walls.png'); // подгружаем исходник для сцены
    this.load.image('dungeon', '../assets/Prison/dungeon.png'); // подгружаем исходник для сцены
    this.load.tilemapTiledJSON('prison', '../assets/Prison/prison.json'); // карта в жсоне для сцены
    this.load.atlas(
      'person',
      '../assets/Prison/person.png',
      '../assets/Prison/person.json'
    ); // имя / пнг / жсон
    this.load.atlas(
      'zombie',
      ' ../assets/Prison/zombie.png',
      '../assets/Prison/zombie.json'
    );
    this.load.image('bullet', '../assets/Prison/bullet.png');
  }

  create() {
    this.scene.start('game'); // запускаем сцену
  }
}
