import Phaser from 'phaser';
import Zombie from './enemies/zombie';

export default class Game extends Phaser.Scene {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  private person = Phaser.Physics.Arcade.Sprite;

  private zombie = Phaser.Physics.Arcade.Sprite;

  private bullets;

  private mouseX;

  private mouseY;

  private isDown = false;

  private lastFired = 0;

  private fireRate = 100;

  static target = new Phaser.Math.Vector2();

  constructor() {
    super('game');
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.mouse = this.input.mousePointer;
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

    walls.setCollisionByProperty({ collides: true });
    assets.setCollisionByProperty({ collides: true });

    // debut graphics
    const debugGraphics = this.add.graphics().setAlpha(0.25);
    walls.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 47, 255),
    });

    this.person = this.physics.add.sprite(
      200,
      360,
      'person'
      // 'Human_1_Idle0.png'
    );

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

    this.physics.add.collider(this.person, walls);
    this.physics.add.collider(this.person, assets);
    this.physics.add.collider(this.bullets, walls);
    this.physics.add.collider(this.bullets, this.zombie);

    // this.input.on('pointermove', pointer => {
    //   Game.target.x = pointer.x;
    //   Game.target.y = pointer.y;
    // });

    this.physics.add.collider(this.zombie, assets);
    this.physics.add.collider(this.zombie, walls);
    this.physics.add.collider(
      this.bullets,
      this.zombie,
      this.handleBulletCollisionWithEnemy,
      undefined,
      this
    );

    this.input.on('pointermove', pointer => {
      // console.log(pointer);
      Game.target.x = pointer.x;
      Game.target.y = pointer.y;
    });
    // this.person.body.setSize(this.person.width * 0.6, this.person.height * 0.6);
    // this.cameras.main.startFollow(this.person, true);

    // if (this.mouse.leftButtonDown()) {
    //   // console.log(this.mouse.movementX);
    //   this.shoot();
    // }

    const Bullet = new Phaser.Class({
      Extends: Phaser.GameObjects.Image,

      initialize: function Bullet(scene) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet1');

        this.incX = 0;
        this.incY = 0;
        this.lifespan = 0;

        this.speed = Phaser.Math.GetSpeed(600, 1);
      },

      fire: function (x, y) {
        this.setActive(true);
        this.setVisible(true);

        //  Bullets fire from the middle of the screen to the given x/y
        this.setPosition(400, 300);

        const angle = Phaser.Math.Angle.Between(x, y, 400, 300);

        this.setRotation(angle);

        this.incX = Math.cos(angle);
        this.incY = Math.sin(angle);

        this.lifespan = 1000;
      },

      update: function (time, delta) {
        this.lifespan -= delta;

        this.x -= this.incX * (this.speed * delta);
        this.y -= this.incY * (this.speed * delta);

        if (this.lifespan <= 0) {
          this.setActive(false);
          this.setVisible(false);
        }
      },
    });

    this.bullets = this.add.group({
      classType: Bullet,
      maxSize: 50,
      runChildUpdate: true,
    });

    this.input.on('pointerdown', pointer => {
      this.isDown = true;
      this.mouseX = pointer.x;
      this.mouseY = pointer.y;
    });

    this.input.on('pointermove', pointer => {
      this.mouseX = pointer.x;
      this.mouseY = pointer.y;
    });

    this.input.on('pointerup', () => {
      this.isDown = false;
    });
  }

  private handleBulletCollisionWithEnemy(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {}

  update(time, delta): void | boolean {
    if (!this.cursors || !this.person) {
      return false;
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
    this.zombie.rotation = Phaser.Math.Angle.BetweenPoints(
      this.zombie,
      this.person
    );

    if (this.isDown && time > lastFired) {
      const bullet = this.bullets.get();

      if (bullet) {
        bullet.fire(this.mouseX, this.mouseY);

        lastFired = time + 50;
      }
    }

    // this.input.on('pointerdown', pointer => {
    //   // самонаводящиеся пули
    //   // console.log(pointer);
    //   Game.target.x = pointer.x;
    //   Game.target.y = pointer.y;
    //   this.shoot(pointer);
    // });

    // this.physics.moveToObject(this.zombie, this.person, 50);
  }
}
