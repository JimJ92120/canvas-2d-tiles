export enum Direction {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
}

export default class Player {
  position: [number, number];
  direction: Direction;
  readonly spriteUrl: string | null;
  sprite: HTMLImageElement;
  readonly animationDuration: number;
  isMoving: boolean = false;

  constructor(
    position: Player["position"],
    direction: Player["direction"],
    spriteUrl: Player["spriteUrl"],
    animationDuration: Player["animationDuration"]
  ) {
    this.position = position;
    this.direction = direction;
    this.spriteUrl = spriteUrl;
    this.animationDuration = animationDuration;
  }

  async init(): Promise<void> {
    if (!this.spriteUrl || "" === this.spriteUrl) {
      return;
    }

    this.sprite = await this.loadImage(this.spriteUrl);
  }

  getSpritePosition(): [number, number] {
    switch (this.direction) {
      case Direction.Up:
        return [2, 0];

      case Direction.Down:
        return [0, 0];

      case Direction.Left:
        return [1, 0];

      case Direction.Right:
        return [3, 0];

      default:
        return [0, 0];
    }
  }

  getSpriteAnimationPositionList(): [number, number][] {
    switch (this.direction) {
      case Direction.Up:
        return [
          [2, 0],
          [2, 1],
          [2, 2],
          [2, 3],
        ];

      case Direction.Down:
        return [
          [0, 0],
          [0, 1],
          [0, 2],
          [0, 3],
        ];

      case Direction.Left:
        return [
          [1, 0],
          [1, 1],
          [1, 2],
          [1, 3],
        ];

      case Direction.Right:
        return [
          [3, 0],
          [3, 1],
          [3, 2],
          [3, 3],
        ];

      default:
        return [];
    }
  }

  private async loadImage(imageUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = imageUrl!;

      image.addEventListener("load", () => {
        console.log(`${imageUrl} image loaded`);

        resolve(image);
      });
    });
  }
}
