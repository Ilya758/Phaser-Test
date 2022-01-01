import Phaser from 'phaser';

export default class Bullet extends Phaser.GameObjects.Image {
  private incX = 0;

  private incY = 0;

  private lifespan = 0;

  private speed = Phaser.Math.GetSpeed(600, 1);

  private create() {
    Phaser.GameObjects.Image.call(
      this,
      Phaser.GameObjects.Image,
      0,
      0,
      'bullet'
    );
  }

  private fire(x, y, personX, personY) {
    this.setActive(true);
    this.setVisible(true);

    //  Bullets fire from the middle of the screen to the given x/y
    this.setPosition(personX, personY);

    var angle = Phaser.Math.Angle.Between(x, y, personX, personY);

    this.setRotation(angle);

    this.incX = Math.cos(angle);
    this.incY = Math.sin(angle);

    this.lifespan = 1000;
  }

  update(time, delta) {
    this.lifespan -= delta;

    this.x -= this.incX * (this.speed * delta);
    this.y -= this.incY * (this.speed * delta);

    if (this.lifespan <= 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}

// var Bullet = new Phaser.Class({
//   Extends: Phaser.GameObjects.Image,

//   // initialize: function Bullet(scene) {
//   //   Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

//   //   this.incX = 0;
//   //   this.incY = 0;
//   //   this.lifespan = 0;

//   //   this.speed = Phaser.Math.GetSpeed(600, 1);
//   // },

// //   fire: function (x, y, personX, personY) {
// //     this.setActive(true);
// //     this.setVisible(true);

// //     //  Bullets fire from the middle of the screen to the given x/y
// //     this.setPosition(personX, personY);

// //     var angle = Phaser.Math.Angle.Between(x, y, personX, personY);

// //     this.setRotation(angle);

// //     this.incX = Math.cos(angle);
// //     this.incY = Math.sin(angle);

// //     this.lifespan = 1000;
// //   },

//   update: function (time, delta) {
//     this.lifespan -= delta;

//     this.x -= this.incX * (this.speed * delta);
//     this.y -= this.incY * (this.speed * delta);

//     if (this.lifespan <= 0) {
//       this.setActive(false);
//       this.setVisible(false);
//     }
//   },
// });
