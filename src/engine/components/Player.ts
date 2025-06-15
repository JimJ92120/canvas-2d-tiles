export enum Direction {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
}

export default class Player {
  position: [number, number];
  direction: Direction;

  constructor(position: Player["position"], direction: Direction) {
    this.position = position;
    this.direction = direction;
  }
}
