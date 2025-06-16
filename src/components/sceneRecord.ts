import Scene, { SceneEventType } from "../engine/components/Scene";

import Scene1BackgroundImageUrl from "../assets/map.png";

export default {
  map: new Scene(
    "map",
    [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1],
      [1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1],
      [1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    {
      "2:2": {
        type: SceneEventType.Load,
        data: "home",
      },
      "7:2": {
        type: SceneEventType.Prompt,
        data: ["a large building", "it is closed"],
      },
      "8:2": {
        type: SceneEventType.View,
        data: "#test",
      },
      "16:2": {
        type: SceneEventType.Prompt,
        data: ["a small building"],
      },
      //
      "14:10": {
        type: SceneEventType.Prompt,
        data: ["a small building"],
      },
      "17:10": {
        type: SceneEventType.Prompt,
        data: ["a small building"],
      },
      //
      "3:12": {
        type: SceneEventType.Prompt,
        data: ["a large building", "closed"],
      },
      "4:12": {
        type: SceneEventType.Prompt,
        data: ["a large building", "closed"],
      },
      "8:12": {
        type: SceneEventType.Prompt,
        data: ["a small building\nclosed"],
      },
      //
      "15:14": {
        type: SceneEventType.Prompt,
        data: ["a large building"],
      },
      "16:14": {
        type: SceneEventType.Prompt,
        data: ["a large building"],
      },
      //
      "3:16": {
        type: SceneEventType.Load,
        data: "home",
      },
    },
    [2, 3],
    Scene1BackgroundImageUrl
  ),
  home: new Scene(
    "home",
    [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
      [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
      [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
      [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
      [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    {
      "2:4": {
        type: SceneEventType.Prompt,
        data: ["desk"],
      },
      "4:2": {
        type: SceneEventType.Prompt,
        data: ["guitar"],
      },
      "6:2": {
        type: SceneEventType.Prompt,
        data: ["tinkering"],
      },
      "7:5": {
        type: SceneEventType.Prompt,
        data: ["shelf"],
      },
      "7:6": {
        type: SceneEventType.Prompt,
        data: ["moto"],
      },
      "4:8": {
        type: SceneEventType.Load,
        data: "map",
      },
      "5:8": {
        type: SceneEventType.Load,
        data: "map",
      },
    },
    [4, 7],
    null
  ),
};
