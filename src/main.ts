import "./style.css";

import App from "./App";

import Engine, {
  EngineRendererOptions,
  EnginePromptOptions,
  EngineFrameRecord,
} from "./engine";

import { getScreenSize } from "./helpers";

import { map, home } from "./frames";
import { player } from "./characters";
import { loadKeyboardEvents } from "./events";
import { RendererMode } from "./engine/Renderer";

const DEBUG: boolean = true;
const MAX_SCENE_SIZE: number = 500;
const MINIMUM_FRAME_SIZE: [number, number] = [10, 10];

document.addEventListener("DOMContentLoaded", async () => {
  const screenSize = getScreenSize(MAX_SCENE_SIZE);

  const app = new App(document.querySelector("#app")!);
  app.render();
  app.$container.style.maxWidth = `${screenSize}px`;

  let rendererOptions: EngineRendererOptions = {
    $scene: app.$container.querySelector(".scene")!,
    viewOffset: [0, 0],
    options: {
      mode: RendererMode.Default,
      scene: {
        size: [screenSize, screenSize],
        minimumFrameSize: MINIMUM_FRAME_SIZE,
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
  const promptOptions: EnginePromptOptions = {
    $prompt: app.$container.querySelector(".prompt")!,
    activeClassName: "prompt--active",
  };
  const frameRecord: EngineFrameRecord = {
    main: map,
    home,
  };

  if (DEBUG) {
    rendererOptions.mapScene = {
      $scene: app.$container.querySelector(".debug-scene")!,
      mode: RendererMode.Raw,
    };
    rendererOptions.mapScene.$scene.classList.add("debug-scene--active");
    app.$container.classList.add("app--debug");
  }

  const engine = new Engine(
    player,
    frameRecord,
    rendererOptions,
    promptOptions
  );

  await engine.init();
  loadKeyboardEvents(engine);
});
