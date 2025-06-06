export enum Direction {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
}

export type CharacterSprite = {
  name: string;
  asset: string;
  directionsOffset: {
    [key: string]: [number, number];
  };
  animationsOffsetList: {
    [key: string]: [number, number][];
  };
};

export default class Character {
  readonly name: string;
  position: [number, number];
  direction: Direction;
  readonly sprite: CharacterSprite;

  constructor(
    name: string,
    position: [number, number],
    direction: Direction,
    sprite: CharacterSprite
  ) {
    this.name = name;
    this.position = position;
    this.direction = direction;
    this.sprite = sprite;
  }
}
