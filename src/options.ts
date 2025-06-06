import Engine, {
  EngineRendererOptions,
  EnginePromptOptions,
  EngineFrameRecord,
} from "./engine";
import { RendererMode } from "./engine/Renderer";

import { main, home } from "./components/frames";
import { player } from "./components/characters";

export type EngineOptions = {
  renderer: EngineRendererOptions;
  prompt: EnginePromptOptions;
  frameRecord: EngineFrameRecord;
  player: Engine["player"];
};

export function EngineOptions(
  $scene: EngineRendererOptions["$scene"],
  $mapScene: EngineRendererOptions["$scene"],
  $prompt: EnginePromptOptions["$prompt"],
  screenSize: number,
  minimumFrameSize: EngineRendererOptions["options"]["scene"]["minimumFrameSize"],
  debug: boolean = false
): EngineOptions {
  const renderer: EngineRendererOptions = {
    $scene,
    viewOffset: [0, 0],
    mapScene: !debug
      ? null
      : {
          $scene: $mapScene,
          mode: RendererMode.Raw,
        },
    options: {
      mode: RendererMode.Default,
      scene: {
        size: [screenSize, screenSize],
        minimumFrameSize,
      },
      tile: {
        colors: {
          1: "grey",
          2: "blue",
          3: "green",
        },
      },
      characters: {
        player: {
          color: "red",
        },
      },
    },
  };
  const prompt: EnginePromptOptions = {
    $prompt,
    activeClassName: "prompt--active",
    animationRecord: {},
  };
  const frameRecord: EngineFrameRecord = {
    main,
    home,
  };

  return {
    renderer,
    prompt,
    frameRecord,
    player,
  };
}
