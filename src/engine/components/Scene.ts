export enum SceneEventType {
  Load = "load",
  Prompt = "prompt",
  View = "view",
  Menu = "menu",
}

export type SceneEvent = {
  type: SceneEventType;
  data: any;
};

export type SceneEventRecord = {
  [key: string]: SceneEvent;
};

export default class Scene {
  readonly name: string;
  readonly data: number[][];
  readonly eventRecord: SceneEventRecord;
  readonly initialPlayerPosition: [number, number];
  readonly backgroundImageUrl: string | null;
  #backgroundImage: HTMLImageElement | null = null;

  constructor(
    name: Scene["name"],
    data: Scene["data"],
    eventRecord: Scene["eventRecord"],
    initialPlayerPosition: Scene["initialPlayerPosition"],
    backgroundImageUrl: Scene["backgroundImageUrl"]
  ) {
    this.name = name;
    this.data = data;
    this.eventRecord = eventRecord;
    this.initialPlayerPosition = initialPlayerPosition;
    this.backgroundImageUrl = backgroundImageUrl;
  }

  get size(): [number, number] {
    return [this.data[0] ? this.data[0].length : 0, this.data.length];
  }

  get backgroundImage(): HTMLImageElement | null {
    return this.#backgroundImage;
  }

  async init(): Promise<void> {
    if (!this.backgroundImageUrl || "" === this.backgroundImageUrl) {
      return;
    }

    this.#backgroundImage = await this.loadImage(this.backgroundImageUrl);
  }

  getEvent(position: [number, number]): SceneEvent | null {
    const eventKey = position.join(":");

    return this.eventRecord[eventKey] ?? null;
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
