export enum Direction {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
}

export default class Character {
  readonly name: string;
  position: [number, number];
  direction: Direction;
  readonly assetRecord: { [key: string]: string };

  constructor(
    name: string,
    position: [number, number],
    direction: Direction,
    assetRecord: { [key: string]: string }
  ) {
    this.name = name;
    this.position = position;
    this.direction = direction;
    this.assetRecord = assetRecord;
  }
}
