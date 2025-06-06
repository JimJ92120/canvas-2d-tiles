import Character, { Direction } from "../engine/Character";

import PlayerSprite from "../assets/player.png";

export const player = new Character("player", [0, 0], Direction.Up, {
  name: "player-sprite",
  asset: PlayerSprite,
  directionsOffset: {
    up: [2, 0],
    down: [0, 0],
    left: [1, 0],
    right: [3, 0],
  },
  animationsOffsetList: {
    up: [[2, 1]],
    down: [[0, 1]],
    left: [[1, 1]],
    right: [[3, 1]],
  },
});
