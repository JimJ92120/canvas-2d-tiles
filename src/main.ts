import "./style.css";

import App from "./App";

import Engine, {
  EngineRendererOptions,
  EnginePromptOptions,
  EngineFrameRecord,
} from "./engine";

import { getScreenSize } from "./helpers";
import CONFIG from "./config";

import { map, home } from "./frames";
import { player } from "./characters";
import { loadKeyboardEvents } from "./events";

document.addEventListener("DOMContentLoaded", async () => {
  const screenSize = getScreenSize(CONFIG.MAX_SCENE_SIZE);

  const app = new App(document.querySelector("#app")!);
  app.render();
  app.$container.style.maxWidth = `${screenSize}px`;

  let rendererOptions: EngineRendererOptions = {
    $scene: app.$container.querySelector(".scene")!,
    $debugScene: null,
    viewOffset: [0, 0],
    options: {
      debug: true,
      scene: {
        size: [screenSize, screenSize],
        minimumFrameSize: CONFIG.MINIMUM_FRAME_SIZE,
      },
      tile: {
        colors: CONFIG.TILE_COLORS,
      },
      player: {
        color: CONFIG.PLAYER_COLOR,
      },
    },
  };
  let promptOptions: EnginePromptOptions = {
    $prompt: app.$container.querySelector(".prompt")!,
    activeClassName: "prompt--active",
  };
  const frameRecord: EngineFrameRecord = {
    main: map,
    home,
  };

  if (CONFIG.DEBUG) {
    rendererOptions.options.debug = CONFIG.DEBUG;
    rendererOptions.$debugScene = app.$container.querySelector(".debug-scene")!;
    rendererOptions.$debugScene.classList.add("debug-scene--active");

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
