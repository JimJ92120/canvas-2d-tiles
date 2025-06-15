export enum Direction {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
}

export type SpriteData = {
  imageUrl: string;
  animationDuration: number;
  direction: {
    [Direction.Up]?: [number, number];
    [Direction.Down]?: [number, number];
    [Direction.Left]?: [number, number];
    [Direction.Right]?: [number, number];
  };
  animation: {
    [Direction.Up]?: [number, number][];
    [Direction.Down]?: [number, number][];
    [Direction.Left]?: [number, number][];
    [Direction.Right]?: [number, number][];
  };
};

export default class Player {
  position: [number, number];
  direction: Direction;
  #spriteData: SpriteData | null;
  sprite: HTMLImageElement;
  isMoving: boolean = false;
  #animationIndex: number = -1;

  constructor(
    position: Player["position"],
    direction: Player["direction"],
    spriteData: SpriteData | null
  ) {
    this.position = position;
    this.direction = direction;
    this.#spriteData = spriteData;
  }

  async init(): Promise<void> {
    if (!this.#spriteData || "" === this.#spriteData.imageUrl) {
      return;
    }

    this.sprite = await this.loadImage(this.#spriteData.imageUrl);
  }

  get spritePosition(): [number, number] | null {
    if (!this.#spriteData) {
      return null;
    }

    if (
      this.isMoving &&
      0 <= this.#animationIndex &&
      this.#spriteData.animation[this.direction]
    ) {
      return (
        this.#spriteData.animation[this.direction]![this.#animationIndex!] ??
        null
      );
    } else {
      return this.#spriteData.direction[this.direction] ?? null;
    }
  }

  animate(): void {
    if (!this.#spriteData || !this.#spriteData.animation[this.direction]) {
      return;
    }

    const positionList = this.#spriteData.animation[this.direction]!;

    if (!positionList.length) {
      return;
    }

    this.isMoving = true;
    this.#animationIndex = 0;

    const interval = setInterval(() => {
      ++this.#animationIndex!;

      if (!positionList[this.#animationIndex!]) {
        this.#animationIndex = -1;
        this.isMoving = false;
        clearInterval(interval);

        return;
      }
    }, this.#spriteData.animationDuration / positionList.length);
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
