import Player, { Direction } from "./components/Player";
import Scene, { SceneEvent, SceneEventType } from "./components/Scene";
import Prompt from "./Prompt";
import Renderer from "./Renderer";

export type SceneRecord = {
  map: Scene;
  [key: string]: Scene;
};

export { Direction };

export default class Engine {
  private renderer: Renderer;
  private player: Player;
  private sceneRecord: SceneRecord;
  private prompt: Prompt;

  private animationFrame: number;
  private currentSceneName: string;
  private focusedPosition: [number, number] = [0, 0];
  private lastMapPosition: [number, number] | null = null;

  constructor(
    renderer: Engine["renderer"],
    prompt: Engine["prompt"],
    player: Engine["player"],
    sceneRecord: Engine["sceneRecord"]
  ) {
    this.renderer = renderer;
    this.prompt = prompt;
    this.player = player;
    this.sceneRecord = sceneRecord;
  }

  get isRunning(): boolean {
    return Boolean(this.animationFrame);
  }

  private get currentScene(): Scene {
    return this.sceneRecord[this.currentSceneName];
  }

  async init(welcomeMessage: string[] = []): Promise<void> {
    this.renderer.init();

    await Promise.all(
      Object.keys(this.sceneRecord).map((sceneName) => {
        return this.sceneRecord[sceneName].init();
      })
    );
    await this.player.init();

    this.loadScene("map");

    if (welcomeMessage.length) {
      this.prompt.type(welcomeMessage);
    }
  }

  async nextOrHidePrompt(): Promise<void> {
    return this.prompt.nextOrHide();
  }

  hidePrompt(): void {
    return this.prompt.hide();
  }

  run(): void {
    if (this.isRunning) {
      throw new Error("engine already running");
    }
    console.log("starting engine");

    const renderCallback = () => {
      this.render();

      this.animationFrame = requestAnimationFrame(renderCallback);
    };

    renderCallback();
  }

  stop(): void {
    console.log("stopping engine");

    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = 0;
  }

  loadScene(sceneName: string): void {
    if (!this.sceneRecord[sceneName]) {
      throw new Error(`scene "${sceneName}" doesn't exist`);
    }

    if ("map" === this.currentSceneName && "map" !== sceneName) {
      this.lastMapPosition = [...this.player.position];
    }

    this.currentSceneName = sceneName;

    if ("map" === sceneName && this.lastMapPosition) {
      this.player.position = [...this.lastMapPosition];

      this.lastMapPosition = null;
    } else {
      this.player.position = [...this.currentScene.initialPlayerPosition];
    }

    this.focusPlayer();
    this.render();
  }

  focusPlayer(): void {
    const { position } = this.player;

    let focusedPosition: [number, number] = [...position];

    const { size: rendererSize } = this.renderer;
    const { size: sceneSize } = this.currentScene!;

    const treshold: [number, number] = [
      0 === rendererSize[0] % 2
        ? Math.floor(rendererSize[0] / 2) - 1
        : Math.floor(rendererSize[0] / 2),
      0 === rendererSize[1] % 2
        ? Math.floor(rendererSize[1] / 2) - 1
        : Math.floor(rendererSize[1] / 2),
    ];

    focusedPosition = [
      treshold[0] >= position[0] ? 0 : position[0] - treshold[0],
      treshold[1] >= position[1] ? 0 : position[1] - treshold[1],
    ];

    if (focusedPosition[0] >= sceneSize[0] - rendererSize[0]) {
      focusedPosition[0] = sceneSize[0] - rendererSize[0];
    }

    if (focusedPosition[1] >= sceneSize[1] - rendererSize[1]) {
      focusedPosition[1] = sceneSize[1] - rendererSize[1];
    }

    this.focusedPosition = focusedPosition;
  }

  async movePlayer(direction: Direction): Promise<boolean> {
    if (this.prompt.isTyping) {
      this.prompt.hide();
    }

    if (this.player.isMoving) {
      return false;
    }

    let nextPosition: Player["position"] = [...this.player.position];
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

    this.player.direction = direction;
    this.player.animate();

    const sceneEvent = this.currentScene.getEvent(nextPosition);

    if (!this.canPlayerMove(nextPosition) && !sceneEvent) {
      return false;
    }

    if (sceneEvent) {
      await this.runSceneEvent(sceneEvent);

      return true;
    }

    this.player.position = nextPosition;
    this.focusPlayer();

    return true;
  }

  //
  private render(): void {
    this.renderer.clear();

    this.renderer.renderScene(this.currentScene, this.focusedPosition);

    this.renderer.renderPlayer(this.player, this.focusedPosition);
  }

  private canPlayerMove(nextPosition: Player["position"]): boolean {
    return (
      this.isPositionValid(nextPosition) &&
      0 === this.currentScene.data[nextPosition[1]][nextPosition[0]]
    );
  }

  private isPositionValid(position: [number, number]): boolean {
    return (
      this.currentScene.size[0] > position[0] &&
      this.currentScene.size[1] > position[1] &&
      0 <= position[0] &&
      0 <= position[1]
    );
  }

  private async runSceneEvent(sceneEvent: SceneEvent): Promise<void> {
    switch (sceneEvent.type) {
      case SceneEventType.Load:
        return this.loadScene(sceneEvent.data);

      case SceneEventType.Prompt:
        return this.prompt.type(sceneEvent.data);
    }
  }
}
