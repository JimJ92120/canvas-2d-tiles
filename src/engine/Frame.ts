export enum FrameDataValue {
  Empty = 0,
  Block = 1,
  Building = 2,
  Action = 3,
}
export type FrameData = FrameDataValue[][];

export enum FrameActionType {
  Prompt = "prompt",
  Load = "load",
}
export type FrameAction = {
  type: FrameActionType;
  data: any;
};
export type FrameActionRecord = { [key: string]: FrameAction };

export type FrameActionRunCallback = (action: FrameAction) => void;

export default class Frame {
  readonly data: FrameData;
  readonly actionRecord: FrameActionRecord;
  readonly initialPlayerPosition: [number, number];
  readonly assetRecord: { [key: string]: string };

  constructor(
    data: number[][],
    actionRecord: FrameActionRecord,
    initialPlayerPosition: [number, number],
    assetRecord: { [key: string]: string }
  ) {
    this.data = data;
    this.actionRecord = actionRecord;
    this.initialPlayerPosition = initialPlayerPosition;
    this.assetRecord = assetRecord;
  }

  get width(): number {
    return this.data[0].length;
  }

  get height(): number {
    return this.data.length;
  }

  runAction(
    position: [number, number],
    callback: FrameActionRunCallback
  ): void {
    const action = this.getAction(position);

    if (!action) {
      console.error(`no action found at [${position}]`);

      return;
    }

    callback(action);
  }

  private getAction(position: [number, number]): FrameAction | null {
    return this.actionRecord[position.join(":")] || null;
  }
}
