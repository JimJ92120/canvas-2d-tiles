import Prompt from "./Prompt";
import Renderer, { RendererMode } from "./Renderer";
import Frame, { FrameActionType, FrameDataValue } from "./Frame";
import Character, { Direction } from "./Character";

export type EngineRendererOptions = {
  $scene: Renderer["$scene"];
  mapScene?: {
    $scene: Renderer["$scene"];
    mode: RendererMode;
  };
  viewOffset: Renderer["viewOffset"];
  options: Renderer["options"];
};
export type EnginePromptOptions = {
  $prompt: Prompt["$container"];
  activeClassName: Prompt["activeClassName"];
};
export type EngineFrameRecord = {
  main?: Frame;
} & { [key: string]: Frame };

export default class Engine {
  private frameRecord: EngineFrameRecord = {};
  private currentFrameKey: string = "main";
  readonly player: Character;
  private renderer: Renderer;
  private mapRenderer: Renderer | null = null;
  private prompt: Prompt;
  private mainFrameLastPosition: [number, number] = [0, 0];

  constructor(
    player: Character,
    frameRecord: EngineFrameRecord,
    rendererOptions: EngineRendererOptions,
    promptOptions: EnginePromptOptions
  ) {
    this.player = player;
    this.frameRecord = frameRecord;
    this.renderer = new Renderer(
      rendererOptions.$scene,
      rendererOptions.viewOffset,
      rendererOptions.options
    );

    if (rendererOptions.mapScene) {
      this.mapRenderer = new Renderer(rendererOptions.mapScene.$scene, [0, 0], {
        ...rendererOptions.options,
        mode: rendererOptions.mapScene.mode,
        scene: {
          size: [...rendererOptions.options.scene.size],
          minimumFrameSize: [0, 0],
        },
      });
    }
    this.prompt = new Prompt(
      promptOptions.$prompt,
      promptOptions.activeClassName
    );
  }

  get isPromptShown(): boolean {
    return this.prompt.isShown;
  }

  private get currentFrame(): Frame {
    return this.frameRecord[this.currentFrameKey];
  }

  async init(): Promise<void> {
    this.loadFrame("main");

    this.renderer.init();
    await this.loadAssets(this.renderer);

    if (this.mapRenderer) {
      this.mapRenderer.init();

      if (
        [RendererMode.Default, RendererMode.All].includes(
          this.mapRenderer.options.mode
        )
      ) {
        await this.loadAssets(this.mapRenderer);
      }
    }

    this.render();
  }

  render(): void {
    this.renderer.render(
      this.currentFrameKey,
      "player",
      this.player.position,
      this.player.direction,
      this.currentFrame.data
    );

    if (this.mapRenderer) {
      this.mapRenderer.render(
        this.currentFrameKey,
        "player",
        this.player.position,
        this.player.direction,
        this.currentFrame.data
      );
    }
  }

  nextOrHidePrompt(): boolean {
    if (this.prompt.next()) {
      return true;
    }

    this.prompt.hide();

    return false;
  }

  movePlayer(directionKey: string): boolean {
    this.prompt.hide();

    const direction = this.getDirectionFromKey(directionKey);

    if (!direction) {
      return false;
    }

    const nextPosition = this.getPlayerPositionFromDirection(direction);

    if (!this.isPositionValid(nextPosition)) {
      return false;
    }

    const nextPositionValue =
      this.currentFrame.data[nextPosition[1]][nextPosition[0]];

    this.player.direction = direction;

    switch (nextPositionValue) {
      case FrameDataValue.Empty:
        this.player.position = nextPosition;
        return true;

      case FrameDataValue.Block:
      case FrameDataValue.Building:
        return false;

      case FrameDataValue.Action:
        this.runFrameAction(nextPosition);

        return true;

      default:
        return false;
    }
  }

  private async loadAssets(renderer: Renderer): Promise<void> {
    await renderer.loadAssets("player", this.player.assetRecord);
    await Promise.all(
      Object.keys(this.frameRecord).map((frameKey) =>
        renderer.loadAssets(
          `frame-${frameKey}`,
          this.frameRecord[frameKey].assetRecord
        )
      )
    );
  }

  private loadFrame(frameKey: string): void {
    if (!this.frameRecord[frameKey]) {
      return;
    }

    const previousFrameKey = this.currentFrameKey;
    this.currentFrameKey = frameKey;

    if (
      "main" !== this.currentFrameKey ||
      ("main" === this.currentFrameKey &&
        this.currentFrameKey === previousFrameKey)
    ) {
      this.mainFrameLastPosition = this.player.position;
      this.player.position = this.currentFrame.initialPlayerPosition;
    } else {
      this.player.position = this.mainFrameLastPosition;
    }

    if (this.mapRenderer) {
      this.mapRenderer.resize(
        this.currentFrame.width,
        this.currentFrame.height
      );
    }
  }

  private isPositionValid(nextPosition: [number, number]): boolean {
    // out of bound
    if (
      0 > nextPosition[0] ||
      0 > nextPosition[1] ||
      this.currentFrame.width <= nextPosition[0] ||
      this.currentFrame.height <= nextPosition[1]
    ) {
      console.error(`nextPosition [${nextPosition}] is out of bound`);

      return false;
    }

    return (
      this.currentFrame.data[nextPosition[1]] &&
      !isNaN(Number(this.currentFrame.data[nextPosition[1]][nextPosition[0]]))
    );
  }

  private getDirectionFromKey(directionKey: string): Direction | null {
    let direction: Direction | null = null;

    switch (directionKey) {
      case "up":
        direction = Direction.Up;
        break;

      case "down":
        direction = Direction.Down;
        break;

      case "left":
        direction = Direction.Left;
        break;

      case "right":
        direction = Direction.Right;
        break;
    }

    return direction;
  }

  private getPlayerPositionFromDirection(
    direction: Direction
  ): [number, number] {
    let nextPosition: [number, number] = [...this.player.position];

    switch (direction) {
      case Direction.Up:
        --nextPosition[1];
        break;
      case Direction.Down:
        ++nextPosition[1];
        break;
      case Direction.Left:
        --nextPosition[0];
        break;
      case Direction.Right:
        ++nextPosition[0];
        break;
    }

    return nextPosition;
  }

  private runFrameAction(position: [number, number]): void {
    this.currentFrame.runAction(position, (action) => {
      switch (action.type) {
        case FrameActionType.Prompt:
          this.prompt.show(action.data);
          break;

        case FrameActionType.Load:
          this.loadFrame(action.data);
          break;
      }
    });
  }
}
