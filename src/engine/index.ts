import Prompt from "./Prompt";
import Renderer from "./Renderer";
import Frame, { FrameActionType } from "./Frame";
import EngineObject, { ObjectDirection } from "./EngineObject";

export type RendererOptions = {
  $scene: Renderer["$scene"];
};
export type PromptOptions = {
  $prompt: Prompt["$container"];
  activeClassName: Prompt["activeClassName"];
};

export type EngineOptions = {
  renderer: {
    dimension: [number, number];
    size: [number, number];
  };
  prompt: {
    speed: number;
  };
};

export type EngineState = {
  renderer: {
    currentFrameKey: string;
    frameOffset: [number, number];
    animationIntervalRecord: { [key: string]: any };
    lastPositionRecord: { [key: string]: { [key: string]: [number, number] } };
  };
  prompt: {
    content: string[];
    index: number;
  };
};
const DEFAULT_STATE: EngineState = {
  renderer: {
    currentFrameKey: "",
    frameOffset: [0, 0],
    animationIntervalRecord: {},
    lastPositionRecord: {},
  },
  prompt: {
    content: [],
    index: 0,
  },
};

export type FrameRecord = { main: Frame; [key: string]: Frame };
export type ObjectRecord = { [key: string]: EngineObject };
export type AssetRecord = { [key: string]: HTMLImageElement };

export default class Engine {
  private renderer: Renderer;
  private prompt: Prompt;

  private options: EngineOptions;
  private state: EngineState = { ...DEFAULT_STATE };
  private frameRecord: FrameRecord;
  private objectRecord: ObjectRecord;
  private assetRecord: AssetRecord = {};

  constructor(
    rendererOptions: RendererOptions,
    promptOptions: PromptOptions,
    frameRecord: Engine["frameRecord"],
    objectRecord: Engine["objectRecord"],
    options: Engine["options"]
  ) {
    this.renderer = new Renderer(rendererOptions.$scene);
    this.prompt = new Prompt(
      promptOptions.$prompt,
      promptOptions.activeClassName
    );
    this.frameRecord = frameRecord;
    this.objectRecord = objectRecord;
    this.options = options;
  }

  private get currentFrame(): Frame {
    return this.frameRecord[this.state.renderer.currentFrameKey];
  }

  async init(
    frameKey: string,
    objectKeyToPosition: string = ""
  ): Promise<void> {
    const { dimension, size } = this.options.renderer;

    this.renderer.resize(dimension, size);
    this.loadFrame(frameKey, objectKeyToPosition);

    await Promise.all([
      ...Object.keys(this.frameRecord).map((frameKey) => {
        const frame = this.frameRecord[frameKey];

        return frame.backgroundImageUrl
          ? this.loadImage(`frame-${frameKey}`, frame.backgroundImageUrl)
          : null;
      }),
      ...Object.keys(this.objectRecord).map((objectKey) => {
        const object = this.objectRecord[objectKey];

        return object.spriteImageUrl
          ? this.loadImage(`object-${objectKey}`, object.spriteImageUrl)
          : null;
      }),
    ]);
  }

  render(
    focusObjectKey: string = "",
    objectAnimationOffsetRecord: { [key: string]: [number, number] } = {}
  ): void {
    if ("" === this.state.renderer.currentFrameKey) {
      console.error("current frame not set");

      return;
    }

    this.renderer.clear();
    this.focus(focusObjectKey);

    if (!this.currentFrame.backgroundImageUrl) {
      this.renderer.renderRawScene(
        this.currentFrame.data,
        this.state.renderer.frameOffset,
        this.currentFrame.colors
      );
    } else if (
      this.assetRecord[`frame-${this.state.renderer.currentFrameKey}`]
    ) {
      const backgroundImage =
        this.assetRecord[`frame-${this.state.renderer.currentFrameKey}`];

      this.renderer.renderSceneBackground(
        backgroundImage,
        this.currentFrame.size,
        this.state.renderer.frameOffset
      );
    }

    Object.keys(this.objectRecord).map((objectKey) => {
      const object = this.objectRecord[objectKey];
      const objectPosition: [number, number] = [
        object.position[0] - this.state.renderer.frameOffset[0],
        object.position[1] - this.state.renderer.frameOffset[1],
      ];

      if (this.assetRecord[`object-${objectKey}`]) {
        const spriteImage = this.assetRecord[`object-${objectKey}`];
        const spriteDirectionOffset: [number, number] =
          objectAnimationOffsetRecord[objectKey] ??
          object.getSpriteDirectionOffset();

        this.renderer.renderObjectSprite(
          spriteImage,
          objectPosition,
          spriteDirectionOffset
        );
      } else {
        this.renderer.renderRawObject(objectPosition, object.color);
      }
    });
  }

  focus(objectKey: string): void {
    if ("" === objectKey || !this.objectRecord[objectKey]) {
      return;
    }

    const { position } = this.objectRecord[objectKey];
    const { size: frameSize } = this.currentFrame;
    const { size: rendererSize } = this.options.renderer;
    const treshold: [number, number] = [
      0 === rendererSize[0] % 2
        ? Math.floor(rendererSize[0] / 2) - 1
        : Math.floor(rendererSize[0] / 2),
      0 === rendererSize[1] % 2
        ? Math.floor(rendererSize[1] / 2) - 1
        : Math.floor(rendererSize[1] / 2),
    ];

    let frameOffset: [number, number] = [
      treshold[0] >= position[0] ? 0 : position[0] - treshold[0],
      treshold[1] >= position[1] ? 0 : position[1] - treshold[1],
    ];

    if (frameSize[0] < frameOffset[0] + rendererSize[0]) {
      frameOffset[0] = frameSize[0] - rendererSize[0];
    }

    if (frameSize[1] < frameOffset[1] + rendererSize[1]) {
      frameOffset[1] = frameSize[1] - rendererSize[1];
    }

    this.state.renderer.frameOffset = frameOffset;
  }

  async move(
    objectKey: string,
    directionKey: string,
    focusObjectKey: string = ""
  ) {
    if (!this.objectRecord[objectKey]) {
      console.error(`object ${objectKey} not found`);

      return false;
    }

    const direction = this.getDirectionFromKey(directionKey);

    if (!direction) {
      console.log(`direction ${directionKey} not found`);

      return;
    }

    const animationKey = `${objectKey}-move`;

    if (this.isAnimationRunning(animationKey)) {
      console.error(
        `animation ${animationKey} is already running for ${objectKey} object`
      );

      return;
    }

    this.hideAndResetPrompt();

    const object = this.objectRecord[objectKey];
    const nextPosition = this.getObjectNexPosition(object.position, direction);

    this.objectRecord[objectKey].direction = direction;

    await this.animateObject(
      objectKey,
      `move-${direction}`,
      animationKey,
      focusObjectKey
    );

    if (this.canObjectMove(nextPosition)) {
      this.objectRecord[objectKey].position = nextPosition;
    }

    this.render(focusObjectKey);

    await this.runFrameAction(nextPosition, objectKey);

    return;
  }

  async typeToPrompt(content: string[]): Promise<boolean> {
    if (!(content instanceof Array)) {
      console.error(`${content} is a String`);

      return false;
    }

    if (this.prompt.isShown) {
      console.error("prompt already typing");

      return false;
    }

    this.state.prompt.content = content;

    await this.typePromptContent();

    return true;
  }

  async nextOrHidePrompt(): Promise<boolean> {
    if (!this.prompt.isShown) {
      console.error("prompt not shown");

      return false;
    }

    if (this.state.prompt.content.length === this.state.prompt.index + 1) {
      this.hideAndResetPrompt();
    } else {
      ++this.state.prompt.index;
      await this.typePromptContent();
    }

    return true;
  }

  private hideAndResetPrompt(): void {
    if (this.prompt.isShown) {
      this.prompt.hide();
      this.state.prompt = {
        content: [],
        index: 0,
      };
    }
  }

  private async typePromptContent(): Promise<void> {
    return this.prompt.type(
      this.state.prompt.content[this.state.prompt.index],
      this.options.prompt.speed
    );
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

  private canObjectMove(position: [number, number]): boolean {
    const { size } = this.currentFrame;

    return (
      0 <= position[0] &&
      0 <= position[1] &&
      size[0] > position[0] &&
      size[1] > position[1] &&
      (!this.currentFrame.data[position[1]] ||
        !this.currentFrame.data[position[1]][position[0]])
    );
  }

  private getObjectNexPosition(
    currentPosition: [number, number],
    direction: ObjectDirection
  ): [number, number] {
    let nextPosition: [number, number] = [...currentPosition];

    switch (direction) {
      case ObjectDirection.Up:
        --nextPosition[1];
        break;
      case ObjectDirection.Down:
        ++nextPosition[1];
        break;
      case ObjectDirection.Left:
        --nextPosition[0];
        break;
      case ObjectDirection.Right:
        ++nextPosition[0];
        break;
    }

    return nextPosition;
  }

  private getDirectionFromKey(directionKey: string): ObjectDirection | null {
    let direction: ObjectDirection | null = null;

    switch (directionKey) {
      case "up":
        direction = ObjectDirection.Up;
        break;

      case "down":
        direction = ObjectDirection.Down;
        break;

      case "left":
        direction = ObjectDirection.Left;
        break;

      case "right":
        direction = ObjectDirection.Right;
        break;
    }

    return direction;
  }

  private isAnimationRunning(animationKey: string): boolean {
    return this.state.renderer.animationIntervalRecord[animationKey];
  }

  private async animateObject(
    objectKey: string,
    animationKey: string,
    recordKey: string,
    focusObjectKey: string
  ): Promise<void> {
    const object = this.objectRecord[objectKey];

    if (!object) {
      console.error(`object ${objectKey} not found`);

      return;
    }

    const animation = object.animationRecord[animationKey];

    if (!animation) {
      console.error(
        `animation ${animationKey} for object ${objectKey} not found`
      );

      return;
    }

    const { spritePositionList } = animation;
    let currentSpriteOffsetIndex = 0;

    return new Promise((resolve) => {
      this.state.renderer.animationIntervalRecord[recordKey] = setInterval(
        () => {
          this.render(focusObjectKey, {
            [objectKey]: spritePositionList[currentSpriteOffsetIndex],
          });

          ++currentSpriteOffsetIndex;

          if (spritePositionList.length + 1 <= currentSpriteOffsetIndex) {
            clearInterval(
              this.state.renderer.animationIntervalRecord[recordKey]
            );
            delete this.state.renderer.animationIntervalRecord[recordKey];

            resolve();
          }
        },
        animation.duration / spritePositionList.length
      );
    });
  }

  private loadFrame(
    frameKey: string,
    objectKeyToPosition: string = ""
  ): boolean {
    if (!this.frameRecord[frameKey]) {
      console.error(`${frameKey} frame not found`);

      return false;
    }

    const previousFrameKey = this.state.renderer.currentFrameKey;
    this.state.renderer.currentFrameKey = frameKey;

    if ("" === objectKeyToPosition) {
      return true;
    } else if (!this.objectRecord[objectKeyToPosition]) {
      return false;
    }

    const object = this.objectRecord[objectKeyToPosition];

    if (!this.state.renderer.lastPositionRecord[previousFrameKey]) {
      this.state.renderer.lastPositionRecord[previousFrameKey] = {};
    }

    if ("main" !== frameKey && "main" === previousFrameKey) {
      this.state.renderer.lastPositionRecord[previousFrameKey][
        objectKeyToPosition
      ] = object.position;
    }

    if (
      this.state.renderer.lastPositionRecord[frameKey] &&
      this.state.renderer.lastPositionRecord[frameKey][objectKeyToPosition]
    ) {
      this.objectRecord[objectKeyToPosition].position =
        this.state.renderer.lastPositionRecord[frameKey][objectKeyToPosition];

      delete this.state.renderer.lastPositionRecord[frameKey][
        objectKeyToPosition
      ];
    } else {
      this.objectRecord[objectKeyToPosition].position =
        this.currentFrame.initialPosition;
    }

    return true;
  }

  private async runFrameAction(
    position: [number, number],
    objectKeyToPosition: string = ""
  ): Promise<void> {
    const action = this.currentFrame.actionRecord[`${position.join(":")}`];

    if (!action) {
      // console.error(
      //   `no action found at [${position}] in ${this.state.renderer.currentFrameKey} frame`
      // );

      return;
    }

    switch (action.type) {
      case FrameActionType.Prompt:
        await this.typeToPrompt(action.data);
        break;

      case FrameActionType.Load:
        this.loadFrame(action.data, objectKeyToPosition);
        break;

      default:
        console.error(
          `no action found for type ${action.type} in ${this.state.renderer.currentFrameKey} frame`
        );
        break;
    }
  }
}
