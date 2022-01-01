import Phaser from 'phaser';

export default class Bullet extends Phaser.Physics.Arcade.Image {
  private incX = 0;

  private incY = 0;

  private lifespan = 0;

  private speed = 1000;

  private fire(x: number, y: number, personX: number, personY: number) {
    this.setTexture('bullet');
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(personX, personY);
    const angle = Phaser.Math.Angle.Between(x, y, personX, personY);
    this.setRotation(angle);
    this.incX = Math.cos(angle);
    this.incY = Math.sin(angle);
    this.setVelocity(x - this.incX * this.speed, y - this.incY * this.speed);
    this.lifespan = 1000;
  }

  public callFireMethod(
    x: number,
    y: number,
    personX: number,
    personY: number
  ) {
    return this.fire(x, y, personX, personY);
  }

  update(time: number, delta: number) {
    this.lifespan -= delta;

    if (this.lifespan <= 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}
