import Character, { Direction } from "../engine/Character";

import PlayerUpImage from "../assets/player-up.png";
import PlayerDownImage from "../assets/player-down.png";
import PlayerLeftImage from "../assets/player-left.png";
import PlayerRightImage from "../assets/player-right.png";

export const player = new Character([0, 0], Direction.Up, {
  up: PlayerUpImage,
  down: PlayerDownImage,
  left: PlayerLeftImage,
  right: PlayerRightImage,
});
