import Frame, { FrameActionType } from "../engine/Frame";

import MainBackgroundImage from "../assets/map.png";

const DEFAULT_COLORS: { [key: number]: string } = {
  1: "grey",
  2: "brown",
  3: "lightgreen",
};

export const main = new Frame(
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 1],
    [1, 2, 3, 2, 1, 2, 2, 3, 3, 2, 2, 1, 1, 1, 1, 2, 3, 2, 1, 1],
    [1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1],
    [1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1],
    [1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 2, 3, 2, 2, 3, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 2, 2, 3, 3, 2, 2, 2, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 2, 2, 1],
    [1, 1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 2, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  [2, 3],
  {
    "2:2": {
      type: FrameActionType.Load,
      data: "home",
    },
    "7:2": {
      // type: FrameActionType.Prompt,
      // data: ["a large building"],
      type: FrameActionType.Load,
      data: "home",
    },
    "8:2": {
      type: FrameActionType.Prompt,
      data: ["a large building"],
    },
    "16:2": {
      type: FrameActionType.Prompt,
      data: ["a small building"],
    },
    //
    "14:10": {
      type: FrameActionType.Prompt,
      data: ["a small building"],
    },
    "17:10": {
      type: FrameActionType.Prompt,
      data: ["a small building"],
    },
    //
    "3:12": {
      type: FrameActionType.Prompt,
      data: ["a large building", "closed"],
    },
    "4:12": {
      type: FrameActionType.Prompt,
      data: ["a large building", "closed"],
    },
    "8:12": {
      type: FrameActionType.Prompt,
      data: ["a small building\nclosed"],
    },
    //
    "15:14": {
      type: FrameActionType.Prompt,
      data: ["a large building"],
    },
    "16:14": {
      type: FrameActionType.Prompt,
      data: ["a large building"],
    },
    //
    "3:16": {
      type: FrameActionType.Load,
      data: "home",
    },
  },
  DEFAULT_COLORS,
  MainBackgroundImage
);

export const home = new Frame(
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 3, 1, 3, 1, 1, 1],
    [1, 1, 2, 0, 0, 0, 0, 1, 1, 1],
    [1, 1, 3, 0, 0, 0, 0, 1, 1, 1],
    [1, 1, 2, 0, 0, 0, 0, 3, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 3, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 1, 3, 3, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  [4, 7],
  {
    "2:4": {
      type: FrameActionType.Prompt,
      data: ["desk"],
    },
    "4:2": {
      type: FrameActionType.Prompt,
      data: ["guitar"],
    },
    "6:2": {
      type: FrameActionType.Prompt,
      data: ["tinkering"],
    },
    "7:5": {
      type: FrameActionType.Prompt,
      data: ["shelf"],
    },
    "7:6": {
      type: FrameActionType.Prompt,
      data: ["moto"],
    },
    "4:8": {
      type: FrameActionType.Load,
      data: "main",
    },
    "5:8": {
      type: FrameActionType.Load,
      data: "main",
    },
  },
  DEFAULT_COLORS
);
