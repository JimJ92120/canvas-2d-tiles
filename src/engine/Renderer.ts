export type RendererOptions = {
  debug: boolean;
  scene: {
    size: [number, number];
    minimumFrameSize: [number, number];
  };
  tile: {
    colors: { [key: number]: string };
  };
  player: {
    color: string;
  };
};

export default class Renderer {
  private $scene: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private options: RendererOptions;
  private viewOffset: [number, number];
  private assetRecord: { [key: string]: HTMLImageElement } = {};

  constructor(
    $scene: HTMLCanvasElement,
    viewOffset: [number, number],
    options: RendererOptions
  ) {
    this.$scene = $scene;
    this.context = this.$scene.getContext("2d")!;
    this.viewOffset = viewOffset;
    this.options = options;
  }

  get width(): number {
    return this.$scene.width;
  }

  get height(): number {
    return this.$scene.height;
  }

  private getTileSize(dataSize: [number, number]): [number, number] {
    const { scene } = this.options;

    return scene.minimumFrameSize
      ? [
          scene.size[0] / scene.minimumFrameSize[0],
          scene.size[1] / scene.minimumFrameSize[1],
        ]
      : [scene.size[0] / dataSize[0], scene.size[1] / dataSize[1]];
  }

  resize(width: number, height: number): void {
    this.options.scene.minimumFrameSize = [width, height];

    const tileSize = this.getTileSize([width, height]);

    this.$scene.width = width * tileSize[0];
    this.$scene.height = height * tileSize[1];
  }

  init(): void {
    const { minimumFrameSize } = this.options.scene;

    this.resize(minimumFrameSize[0], minimumFrameSize[1]);
  }

  async loadAssets(
    prefix: string,
    assets: {
      [key: string]: string;
    }
  ): Promise<HTMLImageElement[]> {
    return await Promise.all(
      Object.keys(assets).map((assetKey) =>
        this.loadImage(`${prefix}-${assetKey}`, assets[assetKey])
      )
    );
  }

  render(
    playerPosition: [number, number],
    playerDirection: string,
    data: number[][]
  ): void {
    const { scene } = this.options;

    this.context.clearRect(0, 0, this.width, this.height);

    const dataSize: [number, number] = [data[0].length, data.length];
    const tileSize: [number, number] = this.getTileSize(dataSize);

    if (
      scene.minimumFrameSize &&
      (scene.minimumFrameSize[0] < dataSize[0] ||
        scene.minimumFrameSize[1] < dataSize[1])
    ) {
      this.focus(playerPosition, dataSize);
    } else if (0 !== this.viewOffset[0] || 0 !== this.viewOffset[1]) {
      this.viewOffset = [0, 0];
    }

    this.renderData(data, tileSize);
    this.renderPlayer(playerPosition, playerDirection, tileSize);
  }

  focus(position: [number, number], frameSize: [number, number]): void {
    const { scene } = this.options;

    if (!scene.minimumFrameSize) {
      return;
    }

    const treshold: [number, number] = [
      0 === scene.minimumFrameSize[0] % 2
        ? Math.floor(scene.minimumFrameSize[0] / 2) - 1
        : Math.floor(scene.minimumFrameSize[0] / 2),
      0 === scene.minimumFrameSize[1] % 2
        ? Math.floor(scene.minimumFrameSize[1] / 2) - 1
        : Math.floor(scene.minimumFrameSize[1] / 2),
    ];

    let viewOffset: [number, number] = [
      treshold[0] >= position[0] ? 0 : position[0] - treshold[0],
      treshold[1] >= position[1] ? 0 : position[1] - treshold[1],
    ];

    if (frameSize[0] < viewOffset[0] + scene.minimumFrameSize[0]) {
      viewOffset[0] = frameSize[0] - scene.minimumFrameSize[0];
    }

    if (frameSize[1] < viewOffset[1] + scene.minimumFrameSize[1]) {
      viewOffset[1] = frameSize[1] - scene.minimumFrameSize[1];
    }

    this.viewOffset = viewOffset;
  }

  private async loadImage(
    imageKey: string,
    imageUrl: string
  ): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      this.assetRecord[imageKey] = new Image();
      this.assetRecord[imageKey].src = imageUrl;

      this.assetRecord[imageKey].addEventListener("load", () => {
        console.log(`${imageKey} image loaded`);

        return resolve(this.assetRecord[imageKey]);
      });
    }) as Promise<HTMLImageElement>;
  }

  private renderPlayer(
    playerPosition: [number, number],
    playerDirection: string,
    tileSize: [number, number]
  ): void {
    const { player, debug } = this.options;
    const position: [number, number] = [
      (playerPosition[0] - this.viewOffset[0]) * tileSize[0],
      (playerPosition[1] - this.viewOffset[1]) * tileSize[1],
    ];

    if (debug) {
      this.context.fillStyle = player.color;
      this.context.fillRect(position[0], position[1], tileSize[0], tileSize[1]);

      let directionMarkPosition: [number, number] = [position[0], position[1]];

      switch (playerDirection) {
        case "up":
          directionMarkPosition[0] += tileSize[0] / 2;
          break;

        case "down":
          directionMarkPosition[0] += tileSize[0] / 2;
          directionMarkPosition[1] += tileSize[1];
          break;

        case "left":
          directionMarkPosition[1] += tileSize[1] / 2;
          break;

        case "right":
          directionMarkPosition[0] += tileSize[0];
          directionMarkPosition[1] += tileSize[1] / 2;
          break;

        default:
          return;
      }

      this.context.strokeStyle = "black";
      this.context.lineWidth = 5;

      this.context.beginPath();
      this.context.moveTo(
        position[0] + tileSize[0] / 2,
        position[1] + tileSize[1] / 2
      );
      this.context.lineTo(directionMarkPosition[0], directionMarkPosition[1]);
      this.context.stroke();
    }

    const playerAsset = this.assetRecord[`player-${playerDirection}`];

    if (playerAsset) {
      this.context.drawImage(
        playerAsset,
        position[0],
        position[1],
        tileSize[0],
        tileSize[1]
      );
    }
  }

  private renderData(data: number[][], tileSize: [number, number]): void {
    const { tile, scene, debug } = this.options;
    let clone = [...data];

    if (scene.minimumFrameSize) {
      clone = data
        .slice(
          this.viewOffset[1],
          this.viewOffset[1] + scene.minimumFrameSize[1]
        )
        .map((row) =>
          row.slice(
            this.viewOffset[0],
            this.viewOffset[0] + scene.minimumFrameSize[0]
          )
        );
    }

    if (debug) {
      clone.map((row, rowIndex) => {
        row.map((cellValue, columnIndex) => {
          if (cellValue && tile.colors[cellValue]) {
            this.context.fillStyle = tile.colors[cellValue];
            this.context.fillRect(
              columnIndex * tileSize[0],
              rowIndex * tileSize[1],
              tileSize[0],
              tileSize[1]
            );
          }
        });
      });
    }
  }
}
