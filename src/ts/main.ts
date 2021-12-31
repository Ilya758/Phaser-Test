import '@styles/style';

import Phaser from 'phaser';

import Matter, { Engine, Render, World, Bodies, Body, Runner } from 'matter-js';

import Game from './game';

import Preloader from './preloader';

const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 480,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true,
      // setBounds: {
      //   left: true,
      //   right: true,
      //   top: true,
      //   bottom: true,
      // },
    },
  },
  scene: [Preloader, Game],
  // zoom: 2,
};

export default new Phaser.Game(config);
