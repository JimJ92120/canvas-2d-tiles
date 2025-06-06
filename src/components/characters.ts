import Character, { Direction } from "../engine/Character";

import PlayerSprite from "../assets/player.png";

export const player = new Character("player", [0, 0], Direction.Up, {
  name: "player-sprite",
  asset: PlayerSprite,
  states: {
    up: [2, 0],
    down: [0, 0],
    left: [1, 0],
    right: [3, 0],
  },
});
