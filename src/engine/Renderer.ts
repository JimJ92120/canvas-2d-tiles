export default class Renderer {
  private $scene: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private size: [number, number] = [0, 0];

  constructor($scene: Renderer["$scene"]) {
    this.$scene = $scene;
    this.context = this.$scene.getContext("2d")!;
  }

  get dimension(): [number, number] {
    return [this.$scene.width, this.$scene.height];
  }

  get tileDimension(): [number, number] {
    return [this.dimension[0] / this.size[0], this.dimension[1] / this.size[1]];
  }

  resize(dimension: [number, number], size: [number, number]): void {
    this.$scene.width = dimension[0];
    this.$scene.height = dimension[1];
    this.size = size;
  }

  clear(): void {
    this.context.clearRect(0, 0, this.dimension[0], this.dimension[1]);
  }

  renderSceneBackground(
    backgroundImage: HTMLImageElement,
    size: [number, number],
    offset: [number, number]
  ): void {
    const { tileDimension } = this;

    this.context.translate(
      -offset[0] * this.tileDimension[0],
      -offset[1] * this.tileDimension[1]
    );

    this.context.drawImage(
      backgroundImage,
      0,
      0,
      size[0] * tileDimension[0],
      size[1] * tileDimension[1]
    );

    this.context.setTransform(1, 0, 0, 1, 0, 0);
  }

  renderObjectSprite(
    spriteImage: HTMLImageElement,
    position: [number, number],
    offset: [number, number]
  ): void {
    const { tileDimension } = this;

    this.context.translate(
      position[0] * this.tileDimension[0],
      position[1] * this.tileDimension[1]
    );

    this.context.drawImage(
      spriteImage,
      offset[0] * tileDimension[0],
      offset[1] * tileDimension[1],
      tileDimension[0],
      tileDimension[1],
      0,
      0,
      tileDimension[0],
      tileDimension[1]
    );

    this.context.setTransform(1, 0, 0, 1, 0, 0);
  }

  renderRawScene(
    data: number[][],
    offset: [number, number],
    colors: { [key: number]: string }
  ): void {
    this.context.translate(
      -offset[0] * this.tileDimension[0],
      -offset[1] * this.tileDimension[1]
    );

    data.map((row, rowIndex) => {
      row.map((cellValue, columnIndex) => {
        if (cellValue && colors[cellValue]) {
          this.renderRawObject([columnIndex, rowIndex], colors[cellValue]);
        }
      });
    });

    this.context.setTransform(1, 0, 0, 1, 0, 0);
  }

  renderRawObject(position: [number, number], color: string): void {
    const { tileDimension } = this;

    this.context.fillStyle = color;
    this.context.fillRect(
      position[0] * tileDimension[0],
      position[1] * tileDimension[1],
      tileDimension[0],
      tileDimension[1]
    );
  }
}
