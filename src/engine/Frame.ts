export enum FrameActionType {
  Prompt = "prompt",
  Load = "load",
}
export type FrameAction = {
  type: FrameActionType;
  data: any;
};
export type FrameActionRecord = { [key: string]: FrameAction };

export default class Frame {
  readonly data: number[][];
  readonly initialPosition: [number, number];
  readonly actionRecord: FrameActionRecord;
  readonly colors: { [key: number]: string };
  readonly backgroundImageUrl: string | null;

  constructor(
    data: Frame["data"],
    initialPosition: Frame["initialPosition"],
    actionRecord: Frame["actionRecord"],
    colors: Frame["colors"],
    backgroundImageUrl: Frame["backgroundImageUrl"] = null
  ) {
    this.data = data;
    this.initialPosition = initialPosition;
    this.actionRecord = actionRecord;
    this.colors = colors;
    this.backgroundImageUrl = backgroundImageUrl;
  }

  get size(): [number, number] {
    return [this.data[0].length ?? 0, this.data.length];
  }
}
