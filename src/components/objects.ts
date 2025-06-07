import EngineObject, { ObjectDirection } from "../engine/EngineObject";

import PlayerSpriteImage from "../assets/player.png";

const ANIMATION_DURATION = 150;

export const player = new EngineObject(
  [0, 0],
  ObjectDirection.Down,
  "blue",
  PlayerSpriteImage,
  {
    [ObjectDirection.Up]: [2, 0],
    [ObjectDirection.Down]: [0, 0],
    [ObjectDirection.Left]: [1, 0],
    [ObjectDirection.Right]: [3, 0],
  },
  {
    [`move-${ObjectDirection.Up}`]: {
      spritePositionList: [
        [2, 1],
        [2, 2],
        [2, 3],
      ],
      duration: ANIMATION_DURATION,
    },
    [`move-${ObjectDirection.Down}`]: {
      spritePositionList: [
        [0, 1],
        [0, 2],
        [0, 3],
      ],
      duration: ANIMATION_DURATION,
    },
    [`move-${ObjectDirection.Left}`]: {
      spritePositionList: [
        [1, 1],
        [1, 2],
        [1, 3],
      ],
      duration: ANIMATION_DURATION,
    },
    [`move-${ObjectDirection.Right}`]: {
      spritePositionList: [
        [3, 1],
        [3, 2],
        [3, 3],
      ],
      duration: ANIMATION_DURATION,
    },
  }
);
