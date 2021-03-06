import Phaser from 'phaser';
import Bullet from './bullet';
import Zombie from './enemies/zombie';

export default class Game extends Phaser.Scene {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  private person = Phaser.Physics.Arcade.Sprite;

  private zombie = Phaser.Physics.Arcade.Sprite;

  static target = new Phaser.Math.Vector2();
  private bullets;
  private ship;
  private speed;
  private stats;
  private lastFired = 0;
  private isDown = false;
  private mouseX = 0;
  private mouseY = 0;

  constructor() {
    super('game');
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    // create map
    const map = this.make.tilemap({
      key: 'prison',
    });

    // added tilesets
    const tileset = map.addTilesetImage('dungeon');

    // create layer
    const floor = map.createLayer('floor', tileset, 0, 0);
    const walls = map.createLayer('walls', tileset, 0, 0);
    const assets = map.createLayer('assets', tileset, 0, 0);

    // create collision

    // floor.setCollisionByProperty({ collides: true });
    walls.setCollisionByProperty({ collides: true });
    assets.setCollisionByProperty({ collides: true });

    const debugGraphics = this.add.graphics().setAlpha(0.25);
    walls.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 47, 255),
    });
    this.person = this.physics.add.sprite(
      240,
      240,
      'person'
      // 'Human_1_Idle0.png'
    );

    // this.zombie = this.physics.add.group({
    //   classType: Zombie,
    // });

    // this.zombie.get(100, 100, 'zombie');
    // this.zombie.get(200, 100, 'zombie');

    this.zombie = this.physics.add.sprite(360, 360, 'zombie');

    this.anims.create({
      key: 'left',
      frames: [{ key: 'person', frame: 'Human_5_Idle0.png' }],
    });
    this.anims.create({
      key: 'right',
      frames: [{ key: 'person', frame: 'Human_1_Idle0.png' }],
    });
    this.anims.create({
      key: 'up',
      frames: [{ key: 'person', frame: 'Human_7_Idle0.png' }],
    });
    this.anims.create({
      key: 'down',
      frames: [{ key: 'person', frame: 'Human_3_Idle0.png' }],
    });

    // this.zombie.chasing = true;

    this.physics.add.collider(this.person, walls);
    this.physics.add.collider(this.person, assets);
    this.input.on('pointermove', pointer => {
      Game.target.x = pointer.x;
      Game.target.y = pointer.y;
    });
    this.physics.add.collider(this.zombie, assets);
    this.physics.add.collider(this.zombie, walls);

    this.input.on('pointermove', pointer => {
      Game.target.x = pointer.x;
      Game.target.y = pointer.y;
    });
    // this.person.body.setSize(this.person.width * 0.6, this.person.height * 0.6);
    // this.cameras.main.startFollow(this.person, true);

    this.bullets = this.add.group({
      classType: Bullet,
      maxSize: 10,
      runChildUpdate: true,
    });

    console.log(this.bullets);

    this.input.on('pointerdown', pointer => {
      this.isDown = true;
      this.mouseX = pointer.x;
      this.mouseY = pointer.y;
    });

    this.input.on('pointermove', pointer => {
      this.mouseX = pointer.x;
      this.mouseY = pointer.y;
    });

    this.input.on('pointerup', pointer => {
      this.isDown = false;
    });
  }

  update(time, delta): void | boolean {
    if (!this.cursors || !this.person) {
      return false;
    }

    if (this.isDown && time > this.lastFired) {
      var bullet = this.bullets.get();

      if (bullet) {
        bullet.fire(this.mouseX, this.mouseY, this.person.x, this.person.y);

        this.lastFired = time + 50;
      }
    }

    const speed = 100;

    if (this.cursors.left.isDown) {
      // left
      this.person.anims.play('left');
      this.person.setVelocity(-speed, 0);
      // this.person.angle = -90;
      this.person.setRotation(
        Phaser.Math.Angle.Between(
          Game.target.x,
          Game.target.y,
          this.person.x,
          this.person.y
        ) -
          Math.PI / 2
      );
    } else if (this.cursors.right.isDown) {
      // right
      this.person.anims.play('right');
      this.person.setVelocity(+speed, 0);
      // this.person.angle = 90;
      this.person.setRotation(
        Phaser.Math.Angle.Between(
          Game.target.x,
          Game.target.y,
          this.person.x,
          this.person.y
        ) -
          Math.PI / 2
      );
    } else if (this.cursors.up.isDown && this.cursors.left.isDown) {
      this.person.anims.play('up');
      this.person.setVelocity(-speed);
      this.person.setRotation(
        Phaser.Math.Angle.Between(
          Game.target.x,
          Game.target.y,
          this.person.x,
          this.person.y
        ) -
          Math.PI / 2
      );
    } else if (this.cursors.up.isDown) {
      // up
      this.person.anims.play('up');
      this.person.setVelocity(0, -speed);
      this.person.setRotation(
        Phaser.Math.Angle.Between(
          Game.target.x,
          Game.target.y,
          this.person.x,
          this.person.y
        ) -
          Math.PI / 2
      );
      // this.person.angle = -180;
    } else if (this.cursors.down.isDown) {
      // down
      this.person.anims.play('down');
      this.person.setVelocity(0, +speed);
      // this.person.angle = 180;
      this.person.setRotation(
        Phaser.Math.Angle.Between(
          Game.target.x,
          Game.target.y,
          this.person.x,
          this.person.y
        ) -
          Math.PI / 2
      );
    } else {
      // stand position
      this.person.anims.play('right');
      this.person.setVelocity(0, 0);
      // this.person.angle = 0;
      this.person.setRotation(
        Phaser.Math.Angle.Between(
          Game.target.x,
          Game.target.y,
          this.person.x,
          this.person.y
        ) -
          Math.PI / 2
      );
    }

    if (Phaser.Math.Distance.BetweenPoints(this.zombie, this.person) < 10000) {
      this.zombie.rotation = Phaser.Math.Angle.BetweenPoints(
        this.zombie,
        this.person
      );
      // this.physics.moveToObject(this.zombie, this.person, 100);
    }
  }
}
