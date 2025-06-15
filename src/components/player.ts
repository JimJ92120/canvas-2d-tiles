import Player, { Direction } from "../engine/components/Player";

import PlayerSpriteUrl from "../assets/player.png";

export default new Player([0, 0], Direction.Down, {
  imageUrl: PlayerSpriteUrl,
  animationDuration: 100,
  direction: {
    [Direction.Up]: [2, 0],
    [Direction.Down]: [0, 0],
    [Direction.Left]: [1, 0],
    [Direction.Right]: [3, 0],
  },
  animation: {
    [Direction.Up]: [
      [2, 0],
      [2, 1],
      [2, 2],
      [2, 3],
    ],
    [Direction.Down]: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
    [Direction.Left]: [
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
    ],
    [Direction.Right]: [
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
    ],
  },
});
