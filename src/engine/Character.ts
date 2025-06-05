export enum Direction {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
}

export default class Character {
  position: [number, number];
  direction: Direction;
  readonly assetRecord: { [key: string]: string };

  constructor(
    position: [number, number],
    direction: Direction,
    assetRecord: { [key: string]: string }
  ) {
    this.position = position;
    this.direction = direction;
    this.assetRecord = assetRecord;
  }
}
