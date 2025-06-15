import Player, { Direction } from "./components/Player";
import Scene from "./components/Scene";

export default class Renderer {
  private $canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  readonly dimension: [number, number];
  readonly size: [number, number];
  readonly backgroundColor: string;

  constructor(
    $canvas: Renderer["$canvas"],
    dimension: Renderer["dimension"],
    size: Renderer["size"],
    backgroundColor: Renderer["backgroundColor"]
  ) {
    this.$canvas = $canvas;
    this.context = this.$canvas.getContext("2d")!;
    this.dimension = dimension;
    this.size = size;
    this.backgroundColor = backgroundColor;
  }

  private get tileDimension(): [number, number] {
    return [this.dimension[0] / this.size[0], this.dimension[1] / this.size[1]];
  }

  init(): void {
    this.$canvas.width = this.dimension[0];
    this.$canvas.height = this.dimension[1];
    this.$canvas.style.backgroundColor = this.backgroundColor;

    this.clear();
  }

  clear(): void {
    this.context.clearRect(0, 0, this.dimension[0], this.dimension[1]);
  }

  render(
    scene: Scene,
    player: Player,
    focusedPosition: [number, number]
  ): void {
    this.clear();

    this.translate(focusedPosition, () => {
      this.renderScene(scene);

      this.context.fillStyle = "red";
      this.renderPlayer(player);
    });
  }

  private renderScene(scene: Scene): void {
    scene.data.map((row, rowIndex) => {
      row.map((cellValue, columnIndex) => {
        if (!cellValue) {
          return;
        }

        const sceneEvent = scene.getEvent([columnIndex, rowIndex]);

        this.context.fillStyle = sceneEvent ? "green" : "blue";

        this.renderRawTile([columnIndex, rowIndex]);
      });
    });

    if (scene.backgroundImage) {
      this.context.drawImage(
        scene.backgroundImage,
        0,
        0,
        scene.size[0] * this.tileDimension[0],
        scene.size[1] * this.tileDimension[1]
      );
    }
  }

  private renderPlayer(player: Player): void {
    this.renderRawTile(player.position);

    const translatedPosition: [number, number] = [
      player.position[0] * this.tileDimension[0] + this.tileDimension[0] / 2,
      player.position[1] * this.tileDimension[1] + this.tileDimension[1] / 2,
    ];

    let angle = 0; // Direction.Down
    switch (player.direction) {
      case Direction.Up:
        angle = 180;
        break;

      case Direction.Left:
        angle = 90;
        break;

      case Direction.Right:
        angle = 270;
        break;
    }

    this.context.strokeStyle = "black";
    this.context.lineWidth = 5;

    this.rotate(angle, translatedPosition, () => {
      this.context.beginPath();
      this.context.moveTo(translatedPosition[0], translatedPosition[1]);
      this.context.lineTo(
        translatedPosition[0],
        translatedPosition[1] + this.tileDimension[1] / 2
      );
      this.context.stroke();
    });
  }

  private renderRawTile(position: [number, number]): void {
    this.context.fillRect(
      position[0] * this.tileDimension[0],
      position[1] * this.tileDimension[1],
      this.tileDimension[0],
      this.tileDimension[1]
    );
  }

  private translate(
    offset: [number, number],
    renderCallback: CallableFunction
  ): void {
    this.context.save();
    this.context.translate(
      -offset[0] * this.tileDimension[0],
      -offset[1] * this.tileDimension[1]
    );

    renderCallback();

    this.context.restore();
  }

  private rotate(
    angle: number,
    origin: [number, number],
    renderCallback: CallableFunction
  ): void {
    this.context.save();

    this.context.translate(origin[0], origin[1]);
    this.context.rotate((angle * Math.PI) / 180);
    this.context.translate(-origin[0], -origin[1]);

    renderCallback();

    this.context.restore();
  }
}
